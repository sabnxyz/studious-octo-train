"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CalendarIcon,
  ChartNoAxesColumnIncreasing,
  CircleDashed,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { ETaskPriority, ETaskStatus } from "../page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils/cn";
import { trpc } from "@/lib/utils/trpc";
import { useState } from "react";
import {
  ETaskPriority,
  ETaskStatus,
} from "../../../../../../../backend/src/interfaces/ITask";

const TASK_PRIORITY = ["low", "medium", "high"] as const;

const TASK_STATUS = ["pending", "ongoing", "completed"] as const;

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a task title",
    })
    .max(250, {
      message: "Task title must be less than 250 characters",
    }),
  description: z
    .string()
    .max(1000, {
      message: "Description must be less than 1000 characters",
    })
    .optional(),
  priority: z.enum(TASK_PRIORITY),
  status: z.enum(TASK_STATUS),
  due: z.date().optional(),
});

export const AddNewTaskDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: TASK_PRIORITY["0"],
      status: TASK_STATUS["1"],
    },
  });
  const { mutateAsync } = trpc.task.create.useMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await mutateAsync({
      name: values.name,
      description: values.description,
      priority: values.priority as ETaskPriority,
      status: values.status as ETaskStatus,
      due: values.due as unknown as string,
    });
    setIsOpen(false);
  };

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a title for your task"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write down your task description (Optional)..."
                        autoComplete="off"
                        className="h-40 max-h-80 overflow-y-auto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-3 items-center mt-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="gap-4 capitalize">
                            <div className="flex gap-2 items-center">
                              <ChartNoAxesColumnIncreasing className="size-4" />
                              <SelectValue placeholder="Select priority" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TASK_PRIORITY.map((priority) => (
                            <SelectItem
                              key={priority}
                              value={priority}
                              className="capitalize"
                            >
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="gap-4 capitalize">
                            <div className="flex gap-2 items-center">
                              <CircleDashed className="size-4" />
                              <SelectValue placeholder="Select Status" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TASK_STATUS.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="capitalize"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="due"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start px-3 shadow-none font-normal"
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 opacity-80" />
                              {field.value ? (
                                format(field.value, "MMM dd, yyyy")
                              ) : (
                                <span>Due date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                                new Date(
                                  new Date().setDate(new Date().getDate() - 1)
                                ) || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="border-t border-gray-200 mt-8 pt-4">
                <DialogClose asChild>
                  <Button variant={"outline"} type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="disabled:opacity-70"
                >
                  {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
