"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/utils/trpc";
import ITask, {
  ETaskPriority,
  ETaskStatus,
} from "../../../../../../../backend/src/interfaces/ITask";
import { TaskCreateEditForm } from "./TaskCreateEditForm";
import { ChevronLeft } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export const EditTaskDialog = ({
  task,
  isOpen,
  setIsOpen,
}: {
  task: ITask;
  isOpen: string | undefined;
  setIsOpen: Dispatch<SetStateAction<"edit" | "view" | undefined>>;
}) => {
  const { mutateAsync } = trpc.task.update.useMutation();

  return (
    <Dialog
      open={isOpen === "edit"}
      onOpenChange={(v) => {
        setIsOpen(v ? "edit" : undefined);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your task, #{task.task_id}</DialogTitle>
        </DialogHeader>
        <div>
          <TaskCreateEditForm
            task={task}
            onSubmit={async (values) => {
              await mutateAsync({
                id: task.id,
                name: values.name,
                description: values.description,
                priority: values.priority as ETaskPriority,
                status: values.status as ETaskStatus,
                due: values.due as unknown as string,
              });
              setIsOpen(undefined);
            }}
            footerComponent={(isSubmitting) => (
              <>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsOpen("view");
                  }}
                  className="gap-1 items-center pl-2"
                >
                  <ChevronLeft className="size-3" />
                  <span>Back</span>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update task"}
                </Button>
              </>
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
