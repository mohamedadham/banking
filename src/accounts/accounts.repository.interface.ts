import { Prisma, Account } from '@prisma/client';

export interface IAccountsRepository {
  createAccount(data: Prisma.AccountUncheckedCreateInput): Promise<Account>;
  updateBalance(id: number, newBalance: number): Promise<Account>;
  getAccountById(id: number): Promise<Account>;
}
