import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import {
  signup,
  signin,
  signinByToken,
  logout,
} from "src/services/auth-service";
import authMiddleware from "src/middleware/auth.middleware";

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
      const { cookie, findUser, token } = await signin({
        name: request.body.name,
        password: request.body.password,
      });
      response.setHeader("Set-Cookie", [cookie]);
      response.status(200).json({ data: findUser, message: "signin", token });
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

router
  .route("/signinbytoken")
  .post(
    bodyParser.json(),
    async (
      request: Request<any, any, { token: string }>,
      response: Response,
      next: NextFunction
    ) => {
      try {
        const { cookie, findUser, token } = await signinByToken(
          request.body.token
        );
        response.setHeader("Set-Cookie", [cookie]);
        response
          .status(200)
          .json({ data: findUser, message: "singinByToken", token });
      } catch (error) {
        next(error);
      }
    }
  );

router.post(
  "/logout",
  bodyParser.json(),
  authMiddleware,
  async (
    request: Request<any, any, { name: string }>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const findUser = await logout(request.body.name);

      response.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
      response.status(200).json({ data: findUser, message: "logout" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
