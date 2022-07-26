import { compare, hash } from "bcrypt";
import { HttpException } from "src/exceptions/HttpException";
import { PrismaClient, User } from "@prisma/client";
import { TokenData } from "src/interfaces/auth.interface";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "src/config";
import { isEmpty } from "src/utils/util";

const users = new PrismaClient().user;

export interface UserDto {
  name: string;
  password: string;
  role: string;
  title: string;
  description: string;
  rate: number;
  approved: boolean;
}

export interface UserCredential {
  name: string;
  password: string;
}

export const signup = async (userData: UserDto): Promise<User> => {
  if (isEmpty(userData)) throw new HttpException(400, "You 're not userData");

  const findUser = await users.findUnique({
    where: { name: userData.name },
  });

  if (findUser)
    throw new HttpException(409, `You're name ${userData.name} already exists`);

  const hashedPassword = await hash(userData.password, 10);
  const createUserData = users.create({
    data: { ...userData, password: hashedPassword },
  });
  return createUserData;
};

export const signin = async (
  userCreden: UserCredential
): Promise<{ cookie: string; findUser: User }> => {
  const findUser = await users.findUnique({
    where: { name: userCreden.name },
  });

  if (!findUser)
    throw new HttpException(409, `You 're name ${userCreden.name} not found`);

  const isPasswordMatching = await compare(
    userCreden.password,
    findUser.password
  );

  if (!isPasswordMatching)
    throw new HttpException(409, "You're password not matching");

  const tokenData = createToken(findUser);
  const cookie = createCookie(tokenData);

  return { cookie, findUser };
};

const createToken = (user: User): TokenData => {
  const dataStoredInToken = { id: user.id };
  const secretKey = SECRET_KEY || "";
  const expiresIn = 60 * 60;

  return {
    token: sign(dataStoredInToken, secretKey, { expiresIn }),
    expiresIn,
  };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};
