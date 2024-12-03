import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import { format, formatDistance } from "date-fns";
import { CalendarIcon } from "lucide-react";

export const TaskDue = ({
  dueDaysRemaining,
  due,
}: {
  due: string;
  dueDaysRemaining: number;
}) => {
  return (
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
              {formatDistance(due, new Date(), {
                addSuffix: true,
              })}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent>{format(due, "PP")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
