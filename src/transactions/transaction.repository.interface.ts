import { Transaction, Prisma } from '@prisma/client';

export interface ITransactionsRepository {
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | null>;
  createTransaction(transaction: Prisma.TransactionUncheckedCreateInput);
  updateTransaction(id: number, transaction: Transaction): Promise<Transaction>;
  deleteTransaction(id: number): Promise<void>;
}
