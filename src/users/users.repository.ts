import { IUsersRepository } from './users.repository.interface';
import { PrismaService } from './../../prisma/prisma.service';
import { UserDto } from './users.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data: user });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserByEmailOrUsername(email: string, username: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  async getUserById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(user) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
