import { initTRPC, TRPCError } from "@trpc/server";
import { createContext } from "./context";

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  sse: {
    enabled: true,
    ping: {
      enabled: true,
      intervalMs: 15_000,
    },
    client: {
      // Reconnect if no messages or pings are received for 20 seconds
      reconnectAfterInactivityMs: 20_000,
    },
  },
});

export const publicProcedure = t.procedure;

export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const router = t.router;
