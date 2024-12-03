"use client";

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
import debounce from "lodash.debounce";

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

  const { data, isLoading: isTasksLoading } = trpc.task.getAll.useQuery();
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

    // console.log(active, over, "handleDragEnd");

    if (!over || !active.data.current) return;

    // check if position is still the same
    // if (active.id === over?.id) return;

    // check if its not the same column i.e. moved to different column
    if (
      active.data.current?.sortable.containerId !==
      over?.data.current?.sortable.containerId
      //   &&
      // active.data.current?.sortable.containerId !== over?.id
    ) {
      const newContainerName = over?.id as ETaskStatus;
      const draggedTask = tasks[newContainerName].find(
        (t) => t.id === active.id
      );
      const newIndex = getIndexOfTask(String(active?.id), newContainerName);

      if (draggedTask) {
        // console.log("calling update task 2");
        updateTask({
          id: draggedTask.id,
          index: newIndex,
          status: newContainerName,
        }).then(() => {
          // console.log("updated task");
        });
      }

      // console.log("moved to different column");
      return;
    }

    const containerName = active.data.current?.sortable
      .containerId as ETaskStatus;

    console.log({ containerName });
    const oldIndex = getIndexOfTask(String(active.id), containerName);
    const newIndex = getIndexOfTask(String(over?.id), containerName);

    const draggedTask = tasks[containerName].find((t) => t.id === active.id);

    if (draggedTask) {
      // console.log("calling update task");
      updateTask({
        id: draggedTask.id,
        index: newIndex,
        status: containerName,
      }).then(() => {
        // console.log("updated task");
      });
    }

    setTasks((prev) => {
      if (!over) return prev;

      return {
        ...prev,
        [containerName]: arrayMove(prev[containerName], oldIndex, newIndex).map(
          (t) => {
            if (t.id === active.id) {
              return {
                ...t,
                // update the state of index for the item to the newIndex as our state on client needs to sync immediately to where it was dropped on the column
                // the column applies sorting which reorders the card as soon as it is dropped
                index: newIndex,
                index_updated_at: new Date().toISOString(),
              };
            }
            return t;
          }
        ),
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
        // console.log("in not targetContainer");
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
          // updateTask({
          //   id: draggedTask.id,
          //   status: over.id as ETaskStatus,
          // }).then(() => {
          //   // console.log("updated task");
          // });
        }

        return { ...prev };
      }

      if (initialContainer === targetContainer) {
        const oldIndex = getIndexOfTask(String(active.id), initialContainer);
        const newIndex = getIndexOfTask(String(over?.id), targetContainer);

        const draggedTask = prev[initialContainer].find(
          (t) => t.id === active.id
        );

        prev[initialContainer] = arrayMove(
          prev[initialContainer],
          oldIndex,
          newIndex
        ).map((t) => {
          if (t.id === active.id) {
            return {
              ...t,
              index: newIndex,
              index_updated_at: new Date().toISOString(),
            };
          }
          return t;
        });

        if (draggedTask) {
          // updateTask({
          //   id: draggedTask.id,
          //   index: newIndex,
          // }).then(() => {
          //   // console.log("updated task");
          // });
        }
      } else {
        // console.log("in else");

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
          prev[targetContainer].splice(newIdx, 0, {
            ...draggedTask,
            index: newIdx,
            index_updated_at: new Date().toISOString(),
          });
          // updateTask({
          //   id: draggedTask.id,
          //   status: targetContainer,
          //   index: newIdx,
          // }).then(() => {
          //   // console.log("updated task");
          // });
        }
      }

      return { ...prev };
    });
  };

  // console.log(tasks, "tasks");
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

  trpc.task.onUpdate.useSubscription(undefined, {
    onData: (data: ITask) => {
      console.log("onUpdate", data);
      setTasks((prev) => {
        const oldTask = Object.values(prev)
          .flat()
          .find((t) => t.id === data.id);

        const isTaskAlreadyPresentInNewStatus = prev[data.status].find(
          (t) => t.id === data.id
        );

        if (oldTask && oldTask?.status !== data.status) {
          return {
            ...prev,
            [oldTask?.status]: prev[oldTask?.status].filter(
              (t) => t.id !== data.id
            ),
            [data.status]: isTaskAlreadyPresentInNewStatus
              ? prev[data.status]
              : [...prev[data.status], data],
          };
        }

        return {
          ...prev,
          [data.status]: prev[data.status].map((t) => {
            if (t.id === data.id) {
              return data;
            }
            return t;
          }),
        };
      });
    },
  });

  trpc.task.onDelete.useSubscription(undefined, {
    onData: (data: ITask) => {
      console.log("onDelete", data);
      setTasks((prev) => {
        return {
          ...prev,
          [data.status]: prev[data.status].filter((t) => t.id !== data.id),
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
