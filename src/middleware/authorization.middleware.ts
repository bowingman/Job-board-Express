import { NextFunction, Response } from "express";
import { RequestWithUser } from "src/interfaces/auth.interface";
import { HttpException } from "src/exceptions/HttpException";

export const isAdmin = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "admin") next();
  else next(new HttpException(403, "Foribbden"));
  return;
};

export const isClient = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "client") next();
  else next(new HttpException(403, "Foribbden"));
  return;
};

export const isFreelancer = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "ferelancer") next();
  else next(new HttpException(403, "Foribbden"));
  return;
};
