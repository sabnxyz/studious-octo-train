"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bolt, Ellipsis, Plus, Zap } from "lucide-react";
import { format, formatDistance } from "date-fns";
import { useDrag, useDrop } from "react-dnd";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  useDraggable,
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

type ITaskStatus = "pending" | "ongoing" | "completed";

interface ITask {
  id: number;
  name: string;
  createdAt: Date;
  priority: "low" | "medium" | "high";
  due: Date;
  status: ITaskStatus;
}

export default function Home() {
  const [activeId, setActiveId] = useState<ITask | null>(null);
  const [tasks, setTasks] = useState<Record<ITaskStatus, ITask[]>>({
    pending: [
      {
        id: 1,
        name: "todo",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        priority: "high",
        due: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: "pending",
      },
      {
        id: 2,
        name: "todo 2",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.5),
        priority: "high",
        due: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: "pending",
      },
      {
        id: 3,
        name: "todo 3",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.5),
        priority: "high",
        due: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: "pending",
      },
      {
        id: 4,
        name: "todo 4",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.5),
        priority: "high",
        due: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: "pending",
      },
      {
        id: 5,
        name: "todo 5",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.5),
        priority: "high",
        due: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: "pending",
      },
    ],
    ongoing: [],
    completed: [
      {
        id: 3000,
        name: "todo",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        priority: "high",
        due: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: "pending",
      },
      {
        id: 3001,
        name: "todo 2",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.5),
        priority: "high",
        due: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: "pending",
      },
    ],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getIndexOfTask = (id: number, status: ITaskStatus) => {
    return tasks[status].findIndex((t) => t.id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.count("handleDragEnd");
    const { active, over } = event;

    console.log(active, over, "handleDragEnd");

    if (!over || !active.data.current || !over.data.current) return;

    // check if position is still the same
    if (active.id === over?.id) return;

    // check if its not the same column i.e. moved to different column
    if (
      active.data.current?.sortable.containerId !==
        over?.data.current?.sortable.containerId ||
      active.data.current?.sortable.containerId !== over?.id
    ) {
      console.log("moved to different column,returning");
      return;
    }
    console.log("didnt return");

    const containerName = active.data.current?.sortable
      .containerId as ITaskStatus;

    // console.log({ containerName });
    const oldIndex = getIndexOfTask(Number(active.id), containerName);
    const newIndex = getIndexOfTask(Number(over?.id), containerName);

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
    console.count("handleDragOver");
    const { active, over } = event;

    console.log(event, "handleDragOver");

    // check if item is being dragged into unknown area
    if (!over) return;

    const initialContainer = active.data.current?.sortable
      .containerId as ITaskStatus;
    const targetContainer = over.data.current?.sortable
      .containerId as ITaskStatus;

    if (!initialContainer) return;

    setTasks((prev) => {
      // const temp = { ...prev };

      if (!targetContainer) {
        // when there is no target container the over id will be the container id it is being dragged into
        console.log("No target container", targetContainer);

        // item is already in the list don't add it,
        if (
          prev[over.id as keyof typeof prev].find(
            (t) => t.id === Number(active.id)
          )
        ) {
          return prev;
        }

        const draggedTask = prev[initialContainer].find(
          (t) => t.id === Number(active.id)
        );

        prev[initialContainer] = prev[initialContainer].filter(
          (t) => t.id !== Number(active.id)
        );

        if (draggedTask) {
          prev[over.id as keyof typeof prev].push(draggedTask);
        }

        return { ...prev };
      }

      if (initialContainer === targetContainer) {
        const oldIndex = getIndexOfTask(Number(active.id), initialContainer);
        const newIndex = getIndexOfTask(Number(over?.id), targetContainer);

        prev[initialContainer] = arrayMove(
          prev[initialContainer],
          oldIndex,
          newIndex
        );
      } else {
        const draggedTask = prev[initialContainer].find(
          (t) => t.id === Number(active.id)
        );

        prev[initialContainer] = prev[initialContainer].filter(
          (t) => t.id !== Number(active.id)
        );

        const newIdx = prev[targetContainer].findIndex(
          (t) => t.id === Number(over?.id)
        );

        if (draggedTask) {
          prev[targetContainer].splice(newIdx, 0, draggedTask);
        }
      }

      return { ...prev };
    });
  };

  // const { data } = trpc.hello.useQuery({ name: "geta" });

  // console.log(data, "Data");

  // console.log("tasks", tasks);

  const { data: user } = useUser();

  // console.log({ data });

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="h-20 p-4">
        <div className="flex items-start gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profileImage} />
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
            <Button className="w-full">
              <span>Add New Task</span>
              <Plus />
            </Button>
          </div>
        </aside>
        <main className="h-[calc(100dvh_-_5rem)] pr-4 pb-4 col-[17_/_span_17] col-start-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(e) => {
              const { active } = e;

              console.log(active, "active");
              if (!active.data.current) return;

              setActiveId(
                tasks[
                  active.data.current?.sortable.containerId as ITaskStatus
                ].find((t) => t.id === Number(active.id)) || null
              );
            }}
            onDragEnd={(e) => {
              console.log(e, "E");
              handleDragEnd(e);
            }}
            onDragOver={handleDragOver}
            autoScroll
          >
            <div className="rounded-2xl h-full grid-cols-3 gap-4 grid border border-gray-100 p-4">
              {Object.values(tasks).map((task, i) => {
                return (
                  <StatusColumn
                    key={i}
                    status={Object.keys(tasks)[i] as ITaskStatus}
                    data={task}
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
}: {
  status: ITaskStatus;
  data: Array<ITask>;
}) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });
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
        <div ref={setNodeRef} className="p-2 flex flex-col gap-2">
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
  task: { id: number; name: string; createdAt: Date };
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
        <p className="font-semibold text-gray-500"># {task.id}</p>
        <p className="text-gray-500 text-xs">
          {formatDistance(task.createdAt, new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>
      {task.name}
    </div>
  );
};
