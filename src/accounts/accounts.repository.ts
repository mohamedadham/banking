import { IAccountsRepository } from './accounts.repository.interface';
import { PrismaService } from './../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class AccountsRepository implements IAccountsRepository {
  constructor(private readonly prisma: PrismaService) {
    const prismaa = new PrismaService();
    this.prisma = prismaa;
  }

  async createAccount(data: Prisma.AccountUncheckedCreateInput) {
    return this.prisma.account.create({
      data,
    });
  }

  updateBalance(id: number, newBalance: number) {
    return this.prisma.account.update({
      where: {
        id,
      },
      data: { balance: newBalance },
    });
  }

  async getAccountById(id: number) {
    return await this.prisma.account.findUnique({
      where: {
        id,
      },
    });
  }
}
