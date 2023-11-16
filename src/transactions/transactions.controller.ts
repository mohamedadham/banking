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
  constructor(private readonly transactionsService: TransactionsService) {}

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
  }

  @Post('withdrawal')
  async withdrawal(@Body() body: WithdrawTransactionDto): Promise<void> {
    await this.transactionsService.withdrawal(body.accountId, body.amount);
  }

  @Post('deposit')
  async deposit(@Body() body: DepositTransactionDto): Promise<void> {
    await this.transactionsService.deposit(body.accountId, body.amount);
  }
}
