import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ITask from "../../../../../../../backend/src/interfaces/ITask";
import { TaskPriority } from "./TaskCard/TaskPriority";
import { TaskStatus } from "./TaskCard/TaskStatus";
import { TaskDue } from "./TaskCard/TaskDue";
import { differenceInDays } from "date-fns";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { trpc } from "@/lib/utils/trpc";

export const ViewTaskDialog = ({
  task,
  setIsOpen,
  isOpen,
}: {
  task: ITask;
  isOpen: string | undefined;
  setIsOpen: Dispatch<SetStateAction<"edit" | "view" | undefined>>;
}) => {
  const dueDaysRemaining = task.due
    ? differenceInDays(task.due, new Date())
    : -1;

  const { mutateAsync: deleteTaskAsync, isPending: isTaskDeletePending } =
    trpc.task.delete.useMutation();

  return (
    <Dialog
      open={isOpen === "view"}
      onOpenChange={(v) => {
        setIsOpen(v ? "view" : undefined);
      }}
    >
      <DialogContent className="">
        <div>
          <DialogHeader>
            <DialogTitle>
              #{task.task_id} {task.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-sm flex gap-2 items-center">
            <TaskPriority priority={task.priority} />
            <TaskStatus status={task.status} />

            {task.due && (
              <TaskDue dueDaysRemaining={dueDaysRemaining} due={task.due} />
            )}
          </div>
          <div className="max-h-[50vh] overflow-y-auto">
            <p className="mt-3">{task.description}</p>
          </div>
        </div>
        <DialogFooter>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Trash /> Delete
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <div>
                <p>Are you sure you want to delete this task?</p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2 mt-2">
                  <PopoverClose asChild>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </PopoverClose>
                  <Button
                    className="disabled:opacity-70 disabled:cursor-not-allowed"
                    variant="destructive"
                    disabled={isTaskDeletePending}
                    onClick={async () => {
                      await deleteTaskAsync({
                        id: task.id,
                      });
                      setIsOpen(undefined);
                    }}
                    size="sm"
                  >
                    {isTaskDeletePending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={() => setIsOpen("edit")}>Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
