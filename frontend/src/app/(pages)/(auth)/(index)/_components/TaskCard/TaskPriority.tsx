import { cn } from "@/lib/utils/cn";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { ETaskPriority } from "../../../../../../../../backend/src/interfaces/ITask";

export const TaskPriority = ({ priority }: { priority: ETaskPriority }) => {
  return (
    <div
      className={cn(
        "bg-gray-100 p-1 flex gap-1 items-center rounded-md text-sm font-semibold px-2",
        priority === "high" && "bg-red-100 text-red-700",
        priority === "medium" && "bg-yellow-100 text-yellow-700",
        priority === "low" && "bg-green-100 text-green-700"
      )}
    >
      <ChartNoAxesColumnIncreasing className="size-4" />
      <span>{priority}</span>
    </div>
  );
};
