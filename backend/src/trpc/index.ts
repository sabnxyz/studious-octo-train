import { z } from "zod";
import { taskRouter } from "../routers/task";
import { publicProcedure, router } from "./init";

export const appRouter = router({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
