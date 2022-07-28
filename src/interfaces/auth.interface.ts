import { Request } from "express";
import { User } from "@prisma/client";

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInToken {
  id: number;
}

export interface RequestWithUser extends Request {
  user?: User;
}

export interface RequestWithUserGeneric<P, ResBody, ReqBody>
  extends Request<P, ResBody, ReqBody> {
  user?: User;
}
