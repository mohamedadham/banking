import { PrismaService } from './../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';

@Module({
  providers: [
    PrismaService,
    { provide: 'IUsersRepository', useClass: UsersRepository },
    UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
