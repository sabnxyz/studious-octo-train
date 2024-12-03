"use client"

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import ITask, {
  ETaskStatus,
} from "../../../../../../../backend/src/interfaces/ITask";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { trpc } from "@/lib/utils/trpc";
import { useUser } from "@/hooks/use-user";
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";

export const Board = () => {
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

    // console.log(active, over);

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

  const { data: user, isLoading: isUserLoading } = useUser();

  trpc.task.onCreate.useSubscription(undefined, {
    onData: (data: ITask) => {
      // console.log("Adding from subscription", data);
      setTasks((prev) => {
        return {
          ...prev,
          [data.status]: [...prev[data.status], data],
        };
      });
    },
  });

  return (
    <>
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
              <TaskColumn
                key={i}
                status={taskKey}
                data={tasks?.[taskKey as keyof typeof tasks] || []}
                isLoading={isTasksLoading}
                index={i}
              />
            );
          })}
        </div>
        <DragOverlay>
          {activeId ? <TaskCard task={activeId} fromOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};
