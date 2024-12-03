import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { sendError } from "../utils";
import { DataSource } from "typeorm";
import { Passport } from "./passport";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  handler: (req: Request, res: Response) => {
    return sendError({
      res,
      message: "Too many requests, please try again later.",
      status: 429,
    });
  },
});

const initialMiddlewares = (app: Express, datasource: DataSource) => {
  if (process.env.NODE_ENV == "production") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan("dev"));
  }

  app.set("trust proxy", 1);
  app.use(cookieParser());

  const allowedOrigins = ["http://localhost:3000"];

  app.use(limiter);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  Passport(app, datasource);
};

export default initialMiddlewares;
