import { ITransactionsRepository } from './transaction.repository.interface';
import { PrismaService } from './../../prisma/prisma.service';
import { Transaction, Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

export class TransactionsRepository implements ITransactionsRepository {
  constructor(private readonly prisma: PrismaService) {
    const prismaa = new PrismaClient();
    this.prisma = prismaa;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany();
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    return await this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  createTransaction(transaction: Prisma.TransactionUncheckedCreateInput) {
    return this.prisma.transaction.create({
      data: transaction,
    });
  }

  async updateTransaction(
    id: number,
    transaction: Transaction,
  ): Promise<Transaction> {
    return await this.prisma.transaction.update({
      where: { id },
      data: transaction,
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }
}
