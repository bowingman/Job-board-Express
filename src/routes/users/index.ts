import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import * as core from "express-serve-static-core";
import authMiddleware from "src/middleware/auth.middleware";
import {
  findUserByRole,
  createUser,
  findUser,
  updateUser,
  deleteUser,
  approveUser,
} from "src/services/dupuser-service";
import {
  RequestWithUser,
  RequestWithUserGeneric,
} from "src/interfaces/auth.interface";

import { HttpException } from "src/exceptions/HttpException";

const router = Router();

router.get(
  "/",
  bodyParser.json(),
  authMiddleware,
  async (_: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const findAllUsersData = await findUserByRole(_.user?.role);

      response
        .status(200)
        .json({ data: findAllUsersData, message: "findUser" });
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
      const createUserData = await createUser({
        name: request.body.name,
        password: request.body.password,
        role: request.body.role,
        title: request.body.title,
        description: request.body.description,
        rate: 0,
        approved: false,
      });

      if (!createUserData) throw new HttpException(409, createUserData);

      response
        .status(200)
        .json({ data: createUserData, message: "createUser" });
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
      const findUserData = await findUser(Number(request.params.id));

      if (!findUserData) throw new HttpException(409, "You're not user");

      response.status(200).json({ data: findUserData, message: "findUser" });
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
      {
        name: string;
        title: string;
        description: string;
        role: string;
        approved: boolean;
        password: string;
      }
    >,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const updateUserData = await updateUser(Number(request.params.id), {
        name: request.body.name,
        title: request.body.title,
        description: request.body.description,
        role: request.body.role,
        approved: request.body.approved,
        password: request.body.password,
      });

      if (!updateUserData) throw new HttpException(409, "You're note user");

      response
        .status(200)
        .json({ data: updateUserData, message: "updateUser" });
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
      const deleteUserData = await deleteUser(Number(request.params.id));

      if (!deleteUser) throw new HttpException(409, "You are not user");

      response
        .status(200)
        .json({ data: deleteUserData, message: "deleteUser" });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id/approve",
  bodyParser.json(),
  authMiddleware,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const approvedUserData = await approveUser(Number(request.params.id));

      if (!approvedUserData) throw new HttpException(409, "You are not user");

      response
        .status(200)
        .json({ data: approvedUserData, message: "approveUser" });
    } catch (error) {
      next(error);
    }
  }
);
// .post(bodyParser.json(), (request: Request, response: Response) => {
//   response.json(
//     createOne({ username: (request.body as Omit<User, "id">).username })
//   );
// });

// router.get('/:id', (request: Request, response: Response) => {
//   response.json(findOne(request.params.id));
// });

// router.delete('/:id', (request: Request, response: Response) => {
//   deleteOne(request.params.id);
//   response.sendStatus(204);
// });

export default router;
