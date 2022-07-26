import { PrismaClient, User } from "@prisma/client";

const users = new PrismaClient().user;

export const findAllUser = async (): Promise<User[]> => {
  const allUser: User[] = await users.findMany();
  return allUser;
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
