import { Request, Response } from "express";
import { Router } from "express";
import { HttpStatusCode } from "axios";
import { DataSource } from "typeorm";
import passport from "passport";
import { sendError, sendSuccess } from "../utils";

const router = Router();

export const AuthController = (datasource: DataSource) => {
  router.get("/", (req: Request, res: Response) => {
    return sendSuccess({
      res,
      status: HttpStatusCode.Ok,
      data: req.user,
    });
  });

  router.get("/error", (req, res) =>
    sendError({
      res,
      status: HttpStatusCode.BadRequest,
      message: "Something went wrong!",
    })
  );

  router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );

  router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/auth/error" }),
    function (req, res) {
      res.redirect(process.env.FRONTEND_URL);
    }
  );

  router.get("/logout", (req, res) => {
    req.logout(function (err) {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    });
  });

  return router;
};
