import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";

import connectDatabase from "./bootstrap/database";
import initialMiddlewares from "./middlewares";
import baseRouter from "./routes";
import { appRouter } from "./trpc";

const getApp = async () => {
  const app = express();
  const datasource = await connectDatabase();

  initialMiddlewares(app, datasource);

  app.use(express.json({ limit: "10mb" }));

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: () => ({}),
    })
  );

  app.use("/api", baseRouter(datasource));

  return app;
};

export default getApp;
