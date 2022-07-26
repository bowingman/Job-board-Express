import { NextFunction, RequestHandler, Response } from "express";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { SECRET_KEY } from "src/config";
import { HttpException } from "src/exceptions/HttpException";
import {
  DataStoredInToken,
  RequestWithUser,
} from "src/interfaces/auth.interface";

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      (
        req.cookies as {
          Authorization: string;
        }
      )?.["Authorization"] ??
      (req.header("Authorization")
        ? req.header("Authorization")?.split("Bearer ")[1]
        : null);

    console.log(Authorization);

    if (Authorization) {
      const secretKey = SECRET_KEY || "";
      const verificationResponse = verify(
        Authorization,
        secretKey
      ) as DataStoredInToken;
      const userId = verificationResponse.id;

      const users = new PrismaClient().user;
      const findUser = await users.findUnique({
        where: { id: Number(userId) },
      });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Wrong authentication token"));
      }
    } else {
      next(new HttpException(401, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }

  return;
};

export default authMiddleware;
