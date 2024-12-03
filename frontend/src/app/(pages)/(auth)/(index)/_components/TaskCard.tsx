import { useSortable } from "@dnd-kit/sortable";
import ITask from "../../../../../../../backend/src/interfaces/ITask";
import { differenceInDays, format, formatDistance } from "date-fns";
import { CSS } from "@dnd-kit/utilities";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import { CalendarIcon, ChartNoAxesColumnIncreasing } from "lucide-react";

export const TaskCard = ({
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

  const dueDaysRemaining = task.due
    ? differenceInDays(task.due, new Date())
    : -1;

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
        <div className="text-gray-500 text-sm mt-1">{task.description}</div>
      </div>
      <div className="mt-5 pt-3 flex gap-2 opacity-70 border-t border-gray-100">
        <div
          className={cn(
            "bg-gray-100 p-1 flex gap-1 items-center rounded-md text-sm font-semibold px-2",
            task.priority === "high" && "bg-red-100 text-red-700",
            task.priority === "medium" && "bg-yellow-100 text-yellow-700",
            task.priority === "low" && "bg-green-100 text-green-700"
          )}
        >
          <ChartNoAxesColumnIncreasing className="size-4" />
          <span>{task.priority}</span>
        </div>
        {task.due && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "p-1 flex gap-1 items-center rounded-md text-sm font-semibold px-2 text-violet-700 bg-violet-100",
                    dueDaysRemaining <= 15 && "text-amber-700 bg-amber-100",
                    dueDaysRemaining <= 7 && "text-fuchsia-700 bg-fuchsia-100",
                    dueDaysRemaining <= 1 && "text-red-700 bg-red-100",
                    dueDaysRemaining < 0 && "bg-gray-100"
                  )}
                >
                  <CalendarIcon className="size-4 opacity-80" />
                  <span>
                    {formatDistance(task.due, new Date(), {
                      addSuffix: true,
                    })}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>{format(task.due, "PP")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
