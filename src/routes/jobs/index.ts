import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import authMiddleware from "src/middleware/auth.middleware";
import * as core from "express-serve-static-core";

import {
  RequestWithUser,
  RequestWithUserGeneric,
} from "src/interfaces/auth.interface";
import {
  createJob,
  deleteJob,
  findJob,
  findJobByRole,
  updateJob,
} from "src/services/job-service";

const router = Router();

router.get(
  "/",
  bodyParser.json(),
  authMiddleware,
  async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const findAllJobsData = await findJobByRole(request.user);

      response.status(200).json({ data: findAllJobsData, message: "findJob" });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  bodyParser.json(),
  authMiddleware,
  async (
    request: RequestWithUserGeneric<
      core.ParamsDictionary,
      any,
      {
        title: string;
        description: string;
        rate: number;
        userId: number;
      }
    >,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const createJobData = await createJob({
        title: request.body.title,
        description: request.body.description,
        rate: request.body.rate,
        approved: false,
        status: "ready",
        userId: request.body.userId,
      });

      response.status(200).json({ data: createJobData, message: "createjob" });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  bodyParser.json(),
  authMiddleware,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const findJobData = await findJob(Number(request.params.id));
      response.status(200).json({ data: findJobData, message: "findjob" });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  bodyParser.json(),
  authMiddleware,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const deleteJobData = await deleteJob(Number(request.params.id));
      response.status(200).json({ data: deleteJobData, message: "deletejob" });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  bodyParser.json(),
  authMiddleware,
  async (
    request: RequestWithUserGeneric<
      core.ParamsDictionary,
      any,
      { title: string; description: string; rate: number }
    >,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updateJobData = await updateJob(Number(request.params.id), {
        title: request.body.title,
        description: request.body.description,
      });

      response.status(200).json({ data: updateJobData, message: "updatejob" });
    } catch (error) {
      next(error);
    }
  }
);
