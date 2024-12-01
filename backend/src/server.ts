import express from "express";

import connectDatabase from "./bootstrap/database";
import initialMiddlewares from "./middlewares";
import baseRouter from "./routes";

const getApp = async () => {
  const app = express();
  const datasource = await connectDatabase();

  initialMiddlewares(app, datasource);

  app.use(express.json({ limit: "10mb" }));

  app.use("/api", baseRouter(datasource));

  return app;
};

export default getApp;
