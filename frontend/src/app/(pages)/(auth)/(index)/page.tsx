"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  ChartNoAxesColumnIncreasing,
  Ellipsis,
  Ghost,
  Zap,
} from "lucide-react";
import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  DragOverlay,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { trpc } from "@/lib/utils/trpc";
import { useUser } from "@/hooks/use-user";
import { AddNewTaskDialog } from "./_components/AddNewTaskDialog";
import ITask, {
  ETaskStatus,
} from "../../../../../../backend/src/interfaces/ITask";
import { cn } from "@/lib/utils/cn";

export default function Home() {
  const [activeId, setActiveId] = useState<ITask | null>(null);
  const [tasks, setTasks] = useState<Record<ETaskStatus, ITask[]>>({
    pending: [],
    ongoing: [],
    completed: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    data,
    isLoading: isTasksLoading,
    refetch,
    trpc: gg,
  } = trpc.task.getAll.useQuery();
  const { mutateAsync: updateTask } = trpc.task.update.useMutation();

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const getIndexOfTask = (id: string, status: ETaskStatus) => {
    return tasks?.[status]?.findIndex((t) => t.id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active.data.current || !over.data.current) return;

    // check if position is still the same
    if (active.id === over?.id) return;

    // check if its not the same column i.e. moved to different column
    if (
      active.data.current?.sortable.containerId !==
        over?.data.current?.sortable.containerId ||
      active.data.current?.sortable.containerId !== over?.id
    ) {
      console.log("moved to different column");
      return;
    }

    const containerName = active.data.current?.sortable
      .containerId as ETaskStatus;

    // console.log({ containerName });
    const oldIndex = getIndexOfTask(String(active.id), containerName);
    const newIndex = getIndexOfTask(String(over?.id), containerName);

    setTasks((prev) => {
      if (!over) return prev;

      return {
        ...prev,
        [containerName]: arrayMove(prev[containerName], oldIndex, newIndex),
      };
    });

    setActiveId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    // check if item is being dragged into unknown area
    if (!over) return;

    const initialContainer = active.data.current?.sortable
      .containerId as ETaskStatus;
    const targetContainer = over.data.current?.sortable
      .containerId as ETaskStatus;

    if (!initialContainer) return;

    setTasks((prev) => {
      // const temp = { ...prev };

      if (!targetContainer) {
        console.log("in not targetContainer");
        // when there is no target container the over id will be the container id it is being dragged into

        // item is already in the list don't add it,
        if (
          prev[over.id as keyof typeof prev].find((t) => t.id === active.id)
        ) {
          return prev;
        }

        const draggedTask = prev[initialContainer].find(
          (t) => t.id === active.id
        );

        prev[initialContainer] = prev[initialContainer].filter(
          (t) => t.id !== active.id
        );

        if (draggedTask) {
          prev[over.id as keyof typeof prev].push(draggedTask);
          updateTask({
            id: draggedTask.id,
            status: over.id as ETaskStatus,
          }).then((res) => {
            refetch();
            console.log(res, "Res 2");
          });
        }

        return { ...prev };
      }

      if (initialContainer === targetContainer) {
        const oldIndex = getIndexOfTask(String(active.id), initialContainer);
        const newIndex = getIndexOfTask(String(over?.id), targetContainer);

        prev[initialContainer] = arrayMove(
          prev[initialContainer],
          oldIndex,
          newIndex
        );
      } else {
        console.log("in else");

        const draggedTask = prev[initialContainer].find(
          (t) => t.id === active.id
        );

        prev[initialContainer] = prev[initialContainer].filter(
          (t) => t.id !== active.id
        );

        const newIdx = prev[targetContainer].findIndex(
          (t) => t.id === over?.id
        );

        if (draggedTask) {
          prev[targetContainer].splice(newIdx, 0, draggedTask);
          updateTask({
            id: draggedTask.id,
            status: targetContainer,
          }).then((res) => {
            console.log(res, "Res");
          });
        }
      }

      return { ...prev };
    });
  };

  const { data: user } = useUser();

  trpc.task.onCreate.useSubscription(undefined, {
    onData: (data: ITask) => {
      console.log("Adding from subscription", data);
      setTasks((prev) => {
        return {
          ...prev,
          [data.status]: [...prev[data.status], data],
        };
      });
    },
  });

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="h-20 p-4">
        <div className="flex items-start gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profile_image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <div className="flex items-center gap-1 font-semibold border-yellow-400 border bg-yellow-400/60 text-yellow-900 text-xs py-0.5 px-1 rounded">
              <Zap size={12}></Zap>
              <p>Pro Account</p>
            </div>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-[repeat(20,_minmax(0,1fr))]">
        <aside className="p-4 pt-2 col-span-3">
          <div className="w-full">
            <AddNewTaskDialog />
          </div>
        </aside>
        <main className="h-[calc(100dvh_-_5rem)] pr-4 pb-4 col-[17_/_span_17] col-start-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(e) => {
              const { active } = e;

              // console.log(active, "active");
              if (!active.data.current) return;

              setActiveId(
                tasks?.[
                  active.data.current?.sortable.containerId as ETaskStatus
                ].find((t) => t.id === active.id) || null
              );
            }}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            autoScroll
          >
            <div className="rounded-2xl h-full grid-cols-3 gap-4 grid border border-gray-100 p-4">
              {["pending", "ongoing", "completed"].map((taskKey, i) => {
                return (
                  <StatusColumn
                    key={i}
                    status={taskKey}
                    data={tasks?.[taskKey as keyof typeof tasks] || []}
                    isLoading={isTasksLoading}
                  />
                );
              })}
            </div>
            <DragOverlay>
              {activeId ? <Card task={activeId} fromOverlay /> : null}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
    </div>
  );
}

const StatusColumn = ({
  status,
  data,
  isLoading,
}: {
  status: string;
  data: Array<ITask>;
  isLoading: boolean;
}) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });
  const isEmptyTaskList = data.length === 0 && !isLoading;

  return (
    <div className="bg-gray-100 rounded-xl h-full relative overflow-y-auto overflow-x-hidden">
      <div className="bg-gray-100 p-3 flex justify-between items-center sticky top-0 z-10">
        <p className="text-gray-700 font-semibold capitalize">{status}</p>
        <button>
          <Ellipsis />
        </button>
      </div>
      <SortableContext
        id={status}
        items={data.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            "p-2 flex flex-col gap-2",
            isEmptyTaskList && "grid place-items-center h-[80%]"
          )}
        >
          {isEmptyTaskList && (
            <div className="flex flex-col justify-center items-center gap-3">
              <Ghost className="size-12 text-gray-600" />
              <p>No tasks here yet.</p>
            </div>
          )}
          {data.map((task) => {
            return <Card key={task.id} task={task} />;
          })}
        </div>
      </SortableContext>
    </div>
  );
};

const Card = ({
  task,
  fromOverlay,
}: {
  task: ITask;
  fromOverlay?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // zIndex: isDragging ? 100 : 0,
    opacity: isDragging ? "0.5" : 1,
    cursor: fromOverlay ? "grabbing" : "",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-2 bg-white rounded-xl"
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-500"># {task.task_id}</p>

        <p className="text-gray-500 text-xs">
          {formatDistance(task.created_at, new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div>{task.name}</div>
      <div className="mt-5 pt-3 flex gap-2 opacity-70 border-t border-gray-100">
        <div className="bg-gray-100 p-1 flex gap-1 items-center rounded-md text-sm font-semibold px-2">
          <ChartNoAxesColumnIncreasing className="size-4" />
          <span>{task.priority}</span>
        </div>
        {task.due && (
          <div className="bg-gray-100 p-1 flex gap-1 items-center rounded-md text-sm font-semibold px-2">
            <CalendarIcon className="size-4 opacity-80" />
            <span>
              {formatDistance(task.due, new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
