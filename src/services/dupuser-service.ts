import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcrypt";
import { HttpException } from "src/exceptions/HttpException";

const users = new PrismaClient().user;

export const findUserByRole = async (
  role: string | undefined
): Promise<User[]> => {
  const allUser: User[] =
    role === "admin"
      ? await users.findMany()
      : role === "client"
      ? await users.findMany({
          where: { role: "freelancer" },
        })
      : [];
  return allUser;
};

export const createUser = async (userData: {
  name: string;
  password: string;
  role: string;
  title: string;
  description: string;
  rate: number;
  approved: boolean;
}): Promise<User> => {
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

export const findUser = async (userId: number): Promise<User> => {
  const findUser = await users.findUnique({
    where: { id: userId },
  });

  if (!findUser) throw new HttpException(404, `You're not user`);

  return findUser;
};

export const updateUser = async (
  userId: number,
  userData: {
    name: string;
    role: string;
    title: string;
    description: string;
    approved: boolean;
    password: string;
  }
): Promise<User> => {
  const findUser = await users.findUnique({
    where: { id: userId },
  });

  if (!findUser) throw new HttpException(404, `You're not user`);

  const hashedPassword = await hash(userData.password, 10);
  const updateUserData = await users.update({
    where: { id: userId },
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  return updateUserData;
};

export const deleteUser = async (userId: number): Promise<User> => {
  const findUser = await users.findUnique({ where: { id: userId } });
  if (!findUser) throw new HttpException(409, "You're not user");

  const deleteUserData = await users.delete({ where: { id: userId } });

  return deleteUserData;
};

// export const createOne = ({ username }: Omit<User, "id">): User => {
//   const user = { id: String(users.length + 1), username };
//   users.push(user);
//   return user;
// };

// export const findOne = (id: string): User | undefined => {
//   return users.find((user) => user.id === id);
// };

// export const deleteOne = (id: string): void => {
//   users.splice(
//     users.findIndex((user) => user.id === id),
//     1
//   );
// };
