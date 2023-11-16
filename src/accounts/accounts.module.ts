import { PrismaService } from './../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsRepository } from './accounts.repository';

@Module({
  providers: [AccountsService, PrismaService, AccountsRepository],
  controllers: [AccountsController],
})
export class AccountsModule {}
