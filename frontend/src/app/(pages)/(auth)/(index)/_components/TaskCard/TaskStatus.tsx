import { cn } from "@/lib/utils/cn";
import { CircleDashed, CircleDot, CircleDotDashed } from "lucide-react";
import { ETaskStatus } from "../../../../../../../../backend/src/interfaces/ITask";

const ICON_MAP = {
  completed: <CircleDot className="size-4" />,
  ongoing: <CircleDotDashed className="size-4" />,
  pending: <CircleDashed className="size-4" />,
};
export const TaskStatus = ({ status }: { status: ETaskStatus }) => {
  return (
    <div
      className={cn(
        "bg-gray-100 p-1 flex gap-1 items-center rounded-md text-sm font-semibold px-2",
        status === "pending" && "bg-yellow-100 text-yellow-700",
        status === "ongoing" && "bg-blue-100 text-blue-700",
        status === "completed" && "bg-green-100 text-green-700"
      )}
    >
      {ICON_MAP[status]}
      <span>{status}</span>
    </div>
  );
};
