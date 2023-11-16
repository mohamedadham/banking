import { Prisma, User } from '@prisma/client';

export interface IUsersRepository {
  createUser(user: Prisma.UserCreateInput): Promise<User>;
  getAllUsers(): Promise<Array<User>>;
  getUserByEmailOrUsername(email: string, username: string): Promise<User>;
  getUserById(id: number): Promise<User>;
  updateUser(user: any): Promise<User>;
  deleteUser(id: number): Promise<void>;
}
