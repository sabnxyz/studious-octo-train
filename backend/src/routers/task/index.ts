import { z } from "zod";
import { AppDataSource } from "../../bootstrap/data-source";
import TaskEntity from "../../entity/task_entity";
import { authedProcedure, publicProcedure, router } from "../../trpc/init";
import ITask, { ETaskPriority, ETaskStatus } from "../../interfaces/ITask";
import { UserEntity } from "../../entity";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";

const ee = new EventEmitter();

export const taskRouter = router({
  onCreate: authedProcedure.subscription(() => {
    return observable<ITask>((emit) => {
      const onCreate = (data: ITask) => {
        emit.next(data);
      };

      ee.on("create", onCreate);

      return () => {
        ee.off("create", onCreate);
      };
    });
  }),
  create: authedProcedure
    .input(
      z
        .object({
          name: z.string(),
          description: z.string().optional(),
          priority: z.nativeEnum(ETaskPriority),
          status: z.nativeEnum(ETaskStatus),
          due: z.string().optional(),
        })
        .nullish()
    )
    .mutation(async ({ ctx, input }) => {
      const ds = AppDataSource;
      const taskEntity = ds.getRepository(TaskEntity);
      const userEntity = ds.getRepository(UserEntity);

      const currentUser = await userEntity.findOne({
        where: {
          id: ctx.user?.id,
        },
      });

      const task = taskEntity.create({
        description: input?.description,
        name: input?.name,
        priority: input?.priority,
        status: input?.status,
        task_id: currentUser.tasks_count + 1,
        index: currentUser.tasks_count + 1,
        due: input?.due,
        user: currentUser,
        index_updated_at: new Date().toISOString(),
      });

      currentUser.tasks_count = currentUser.tasks_count + 1;

      await task.save();
      await currentUser.save();

      ee.emit("create", task);

      return {
        message: "Successfully added new task",
      };
    }),
  getAll: authedProcedure.query(async ({ ctx }) => {
    try {
      const ds = AppDataSource;
      const taskEntity = ds.getRepository(TaskEntity);

      const allTasks = await taskEntity.find({
        where: {
          user: {
            id: ctx.user?.id,
          },
        },
      });

      return {
        pending: allTasks.filter((task) => task.status === ETaskStatus.PENDING),
        ongoing: allTasks.filter((task) => task.status === ETaskStatus.ONGOING),
        completed: allTasks.filter(
          (task) => task.status === ETaskStatus.COMPLETED
        ),
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }),
  onUpdate: authedProcedure.subscription(() => {
    return observable<ITask>((emit) => {
      const onUpdate = (data: ITask) => {
        emit.next(data);
      };

      ee.on("update", onUpdate);

      return () => {
        ee.off("update", onUpdate);
      };
    });
  }),
  update: authedProcedure
    .input(
      z
        .object({
          id: z.string(),
          name: z.string().optional(),
          description: z.string().optional(),
          priority: z.nativeEnum(ETaskPriority).optional(),
          status: z.nativeEnum(ETaskStatus).optional(),
          due: z.string().optional(),
          index: z.number().optional(),
        })
        .nullish()
    )
    .mutation(async ({ input, ctx }) => {
      const ds = AppDataSource;
      const taskEntity = ds.getRepository(TaskEntity);

      const task = await taskEntity.findOne({
        where: {
          id: input?.id,
          user: {
            id: ctx.user?.id,
          },
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      task.name = input?.name || task.name;
      task.description = input?.description || task.description;
      task.priority = input?.priority || task.priority;
      task.status = input?.status || task.status;
      task.due = input?.due || task.due;
      task.index = typeof input?.index === "number" ? input?.index : task.index;

      if (typeof input?.index === "number") {
        console.log("inside");
        task.index_updated_at = new Date().toISOString();
      }

      // console.log(task.index_updated_at, "index-");

      await task.save();
      ee.emit("update", task);

      return {
        message: "Successfully updated task",
      };
    }),
  onDelete: authedProcedure.subscription(() => {
    return observable<ITask>((emit) => {
      const onDelete = (data: ITask) => {
        emit.next(data);
      };

      ee.on("delete", onDelete);

      return () => {
        ee.off("delete", onDelete);
      };
    });
  }),
  delete: authedProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .nullish()
    )
    .mutation(async ({ input, ctx }) => {
      const ds = AppDataSource;
      const taskEntity = ds.getRepository(TaskEntity);

      const task = await taskEntity.findOne({
        where: {
          id: input?.id,
          user: {
            id: ctx.user?.id,
          },
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      await taskEntity.remove(task);

      console.log(task, "task");

      ee.emit("delete", { ...task, id: input.id });

      return {
        message: "Successfully deleted task",
      };
    }),
});
