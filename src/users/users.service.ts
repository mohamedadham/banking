import { IUsersRepository } from './users.repository.interface';
import { EntityAlreadyExistError } from './../errors/custom-errors';
import { User } from '@prisma/client';
import { UserDto } from './users.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async createUser(user: User) {
    const existingUser = await this.usersRepository.getUserByEmailOrUsername(
      user.email,
      user.username,
    );

    if (existingUser) {
      throw new EntityAlreadyExistError(
        'User with this email or username already exists',
      );
    }

    const createdUser = await this.usersRepository.createUser({
      ...user,
      dateOfBirth: new Date(user.dateOfBirth),
    });
    return createdUser;
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.usersRepository.getAllUsers();
    return users;
  }

  async getUserById(id: number): Promise<UserDto | null> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      return null;
    }

    return user;
  }

  async updateUser(user: UserDto): Promise<UserDto> {
    const updatedUser = await this.usersRepository.updateUser(user);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.deleteUser(id);
  }
}
