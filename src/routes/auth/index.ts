import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import { signup, signin } from "src/services/auth-service";

const router = Router();

router.route("/signin").post(
  bodyParser.json(),
  async (
    request: Request<
      any,
      any,
      {
        name: string;
        password: string;
      }
    >,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { cookie, findUser } = await signin({
        name: request.body.name,
        password: request.body.password,
      });
      response.setHeader("Set-Cookie", [cookie]);
      response.status(200).json({ data: findUser, message: "signin" });
    } catch (error) {
      next(error);
    }
  }
);

router.route("/signup").post(
  bodyParser.json(),
  async (
    request: Request<
      any,
      any,
      {
        name: string;
        password: string;
        role: string;
        title: string;
        description: string;
      }
    >,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const signUpUserData = await signup({
        name: request.body.name,
        password: request.body.password,
        role: request.body.role,
        title: request.body.title,
        description: request.body.description,
        rate: 0,
        approved: false,
      });
      response.status(201).json({ data: signUpUserData, message: "signup" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
