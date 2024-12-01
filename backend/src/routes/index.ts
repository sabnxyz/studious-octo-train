import { Router } from "express";
import { DataSource } from "typeorm";
import { StatusCodes } from "http-status-codes";
import { AuthController } from "../controllers/authController";

const baseRouter = (datasource: DataSource) => {
  const router = Router();

  router.use("/auth", AuthController(datasource));

  router.get("/db-status", (req, res) => {
    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Database connected successfully",
      current_db: datasource.options.database,
      in_env: process.env.DB_NAME,
    });
  });

  router.use("*", (req, res) => {
    res.status(404).json({
      status: "error",
      message: "Not Found",
    });
  });

  return router;
};

export default baseRouter;
