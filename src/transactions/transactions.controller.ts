import { UsersService } from './../users/users.service';
import { TwilioService } from './../integrations/sms.integrations';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TransactionsService } from './transactions.service';
import {
  WithdrawTransactionDto,
  DepositTransactionDto,
  transferTransactionDto,
} from './dtos/transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly twilioService: TwilioService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionsService.getAllTransactions();
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') id: number,
  ): Promise<Transaction | null> {
    return await this.transactionsService.getTransactionById(id);
  }

  @Post()
  async createTransaction(
    @Body() transaction: Transaction,
  ): Promise<Transaction> {
    return await this.transactionsService.createTransaction(transaction);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: number,
    @Body() transaction: Transaction,
  ): Promise<Transaction> {
    return await this.transactionsService.updateTransaction(id, transaction);
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: number): Promise<void> {
    await this.transactionsService.deleteTransaction(id);
  }

  @Post('transfer')
  async transfer(@Body() body: transferTransactionDto): Promise<void> {
    await this.transactionsService.transfer(body.from, body.to, body.amount);
    const sender = await this.usersService.getUserById(body.from);
    const reciever = await this.usersService.getUserById(body.to);

    // Send SMS notification to the sender.
    await this.twilioService.sendSMS(
      `+2${sender.phoneNumber}`,
      `You have successfully transferred ${body.amount} to ${reciever.phoneNumber}`,
    );
  }

  @Post('withdrawal')
  async withdrawal(@Body() body: WithdrawTransactionDto): Promise<void> {
    await this.transactionsService.withdrawal(body.accountId, body.amount);
    // Send a notification to the user.
    const user = await this.usersService.getUserById(body.accountId);

    await this.twilioService.sendSMS(
      `+2${user.phoneNumber}`,
      `Your withdrawal of ${body.amount} was successful`,
    );
  }

  @Post('deposit')
  async deposit(@Body() body: DepositTransactionDto): Promise<void> {
    await this.transactionsService.deposit(body.accountId, body.amount);

    // Send a SMS notification to the user.
    const user = await this.usersService.getUserById(body.accountId);

    await this.twilioService.sendSMS(
      `+2${user.phoneNumber}`,
      `Your account has been credited with ${body.amount}`,
    );
  }
}
