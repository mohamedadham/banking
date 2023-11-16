import { AccountsRepository } from './../accounts/accounts.repository';
import { UsersRepository } from './../users/users.repository';
import { TwilioService } from './../integrations/sms.integrations';
import { TransactionsRepository } from './transactions.repository';
import { PrismaService } from './../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  providers: [
    PrismaService,
    TransactionsRepository,
    AccountsRepository,
    TransactionsService,
    TwilioService,
    UsersRepository,
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
