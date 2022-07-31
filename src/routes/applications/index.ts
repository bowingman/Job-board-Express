import bodyParser from "body-parser";
import { NextFunction, Router, Response } from "express";
import * as core from "express-serve-static-core";
import authMiddleware from "src/middleware/auth.middleware";
import {
  RequestWithUser,
  RequestWithUserGeneric,
} from "src/interfaces/auth.interface";
import {
  answerApplication,
  createApplication,
  getApplicationByRole,
} from "src/services/application-service";

const router = Router();

router.get(
  "/",
  bodyParser.json(),
  authMiddleware,
  async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const applicationData = await getApplicationByRole(request.user);

      response
        .status(200)
        .json({ data: applicationData, message: "findApplication" });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id/answer",
  bodyParser.json(),
  authMiddleware,
  async (
    request: RequestWithUserGeneric<
      core.ParamsDictionary,
      any,
      { answer: string }
    >,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const answerApplicationData = await answerApplication(
        Number(request.params.id),
        request.body.answer
      );

      response
        .status(200)
        .json({ data: answerApplicationData, message: "answerApplication" });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:id",
  bodyParser.json(),
  authMiddleware,
  async (
    request: RequestWithUserGeneric<
      core.ParamsDictionary,
      any,
      {
        content: string;
        rate: number;
      }
    >,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const createApplicationData = await createApplication({
        content: request.body.content,
        rate: request.body.rate,
        jobId: Number(request.params.id),
        userId: Number(request.user?.id),
        answered: false,
      });

      response
        .status(200)
        .json({ data: createApplicationData, message: "createApplication" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
