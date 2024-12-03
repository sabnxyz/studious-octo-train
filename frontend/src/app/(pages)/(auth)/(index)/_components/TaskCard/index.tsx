"use client";

import { useSortable } from "@dnd-kit/sortable";
import ITask from "../../../../../../../../backend/src/interfaces/ITask";
import { differenceInDays, format, formatDistance } from "date-fns";
import { CSS } from "@dnd-kit/utilities";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { TaskPriority } from "./TaskPriority";
import { TaskDue } from "./TaskDue";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "./TaskStatus";
import { EditTaskDialog } from "../EditTaskDialog";
import { trpc } from "@/lib/utils/trpc";
import { ViewTaskDialog } from "../ViewTaskDialog";

export const TaskCard = ({
  task,
  fromOverlay,
}: {
  task: ITask;
  fromOverlay?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<"edit" | "view" | undefined>(undefined);
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

  const dueDaysRemaining = task.due
    ? differenceInDays(task.due, new Date())
    : -1;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? "0.5" : 1,
    cursor: fromOverlay ? "grabbing" : "",
  };

  return (
    <>
      <EditTaskDialog isOpen={isOpen} setIsOpen={setIsOpen} task={task} />
      <ViewTaskDialog isOpen={isOpen} setIsOpen={setIsOpen} task={task} />
      <div
        onMouseDown={() => {
          setIsOpen("view");
        }}
      >
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          className="p-2 bg-white rounded-xl"
        >
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-500">#{task.task_id}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-500 text-xs">
                    {formatDistance(task.created_at, new Date(), {
                      addSuffix: true,
                    })}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{format(task.created_at, "PP")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-2">
            <div className="line-clamp-2">{task.name}</div>
            <div className="text-gray-500 text-sm mt-1 line-clamp-4">
              {task.description}
            </div>
          </div>
          <div className="mt-5 pt-3 flex gap-2 opacity-70 border-t border-gray-100">
            <TaskPriority priority={task.priority} />
            {task.due && (
              <TaskDue due={task.due} dueDaysRemaining={dueDaysRemaining} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
