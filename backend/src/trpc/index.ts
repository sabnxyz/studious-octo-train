import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const router = t.router;

export const appRouter = t.router({});
export type AppRouter = typeof appRouter;
