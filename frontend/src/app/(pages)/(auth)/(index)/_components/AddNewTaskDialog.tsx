"use client";

import { z } from "zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/utils/trpc";
import { useState } from "react";
import {
  ETaskPriority,
  ETaskStatus,
} from "../../../../../../../backend/src/interfaces/ITask";
import { TaskCreateEditForm } from "./TaskCreateEditForm";

export const AddNewTaskDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync } = trpc.task.create.useMutation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <span>Add New Task</span>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new task</DialogTitle>
        </DialogHeader>
        <div>
          <TaskCreateEditForm
            footerComponent={(isSubmitting) => {
              return (
                <>
                  <DialogClose asChild>
                    <Button variant={"outline"} type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="disabled:opacity-70"
                  >
                    {isSubmitting ? "Adding..." : "Add new task"}
                  </Button>
                </>
              );
            }}
            onSubmit={async (values) => {
              await mutateAsync({
                name: values.name,
                description: values.description,
                priority: values.priority as ETaskPriority,
                status: values.status as ETaskStatus,
                due: values.due as unknown as string,
              });
              setIsOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
