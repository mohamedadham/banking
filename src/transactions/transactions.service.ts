import { IUsersRepository } from './../users/users.repository.interface';
import { IAccountsRepository } from './../accounts/accounts.repository.interface';
import { ITransactionsRepository } from './transaction.repository.interface';
import { TwilioService } from './../integrations/sms.integrations';
import { PrismaService } from './../../prisma/prisma.service';
import { Transaction } from '@prisma/client';
import { Inject, Injectable } from '@nestjs/common';

import {
  InsufficientBalanceError,
  NotFoundError,
} from './../../src/errors/custom-errors';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('ITransactionsRepository')
    private readonly transactionsRepository: ITransactionsRepository,
    @Inject('IAccountsRepository')
    private readonly accountsRepository: IAccountsRepository,
    private readonly prisma: PrismaService,
    @Inject('IUsersRepository')
    private readonly UsersRepository: IUsersRepository,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionsRepository.getAllTransactions();
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    return await this.transactionsRepository.getTransactionById(id);
  }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    return await this.transactionsRepository.createTransaction(transaction);
  }

  async updateTransaction(
    id: number,
    transaction: Transaction,
  ): Promise<Transaction> {
    return await this.transactionsRepository.updateTransaction(id, transaction);
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.transactionsRepository.deleteTransaction(id);
  }

  async deposit(accountId: number, amount: number): Promise<void> {
    // Validate the transaction amount and ensure that the account has sufficient balance.
    const account = await this.accountsRepository.getAccountById(accountId);

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    if (amount > +account.balance) {
      throw new InsufficientBalanceError('Insufficient balance');
    }

    try {
      const withDrawFromAccount = this.accountsRepository.updateBalance(
        accountId,
        +account.balance + amount,
      );

      // Create a new transaction record.
      const withdrawTransaction = this.transactionsRepository.createTransaction(
        {
          senderAccountId: accountId,
          receiverAccountId: accountId,
          transactionType: 'DEPOSIT',
          transactionStatus: 'COMPLETED',
          amount,
        },
      );

      await this.prisma.$transaction([
        withDrawFromAccount,
        withdrawTransaction,
      ]);
    } catch (error) {
      await this.transactionsRepository.createTransaction({
        senderAccountId: accountId,
        receiverAccountId: accountId,
        transactionType: 'DEPOSIT',
        transactionStatus: 'FAILED',
        amount,
      });

      throw new Error(error);
    }
  }

  async withdrawal(accountId: number, amount: number): Promise<void> {
    // Validate the transaction amount and ensure that the account has sufficient balance.
    const account = await this.accountsRepository.getAccountById(accountId);

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    if (amount > +account.balance) {
      throw new InsufficientBalanceError('Insufficient balance');
    }

    try {
      // Update the account balance.
      const withDrawFromAccount = this.accountsRepository.updateBalance(
        accountId,
        +account.balance - amount,
      );

      // Create a new transaction record.
      const withdrawTransaction = this.transactionsRepository.createTransaction(
        {
          senderAccountId: accountId,
          receiverAccountId: accountId,
          transactionType: 'WITHDRAWAL',
          transactionStatus: 'COMPLETED',
          amount,
        },
      );

      await this.prisma.$transaction([
        withDrawFromAccount,
        withdrawTransaction,
      ]);
    } catch (error) {
      await this.transactionsRepository.createTransaction({
        senderAccountId: accountId,
        receiverAccountId: accountId,
        transactionType: 'WITHDRAWAL',
        transactionStatus: 'FAILED',
        amount,
      });

      throw new Error(error);
    }
  }

  async transfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
  ): Promise<void> {
    // Validate the transaction amount and ensure that the account has sufficient balance.
    const fromAccount = await this.accountsRepository.getAccountById(
      fromAccountId,
    );

    if (!fromAccount) {
      throw new NotFoundError('Account not found');
    }

    if (amount > +fromAccount.balance) {
      throw new InsufficientBalanceError('Insufficient balance');
    }

    const toAccount = await this.accountsRepository.getAccountById(toAccountId);

    if (!toAccount) {
      throw new NotFoundError('Account not found');
    }

    try {
      // Update the account balances.
      const withDrawFromAccount = this.accountsRepository.updateBalance(
        fromAccountId,
        +fromAccount.balance - amount,
      );

      const depositBalance = this.accountsRepository.updateBalance(
        toAccountId,
        +toAccount.balance + amount,
      );

      // Create a new transaction record.
      const createTransferTransaction =
        this.transactionsRepository.createTransaction({
          senderAccountId: fromAccountId,
          receiverAccountId: toAccountId,
          transactionType: 'TRANSFER',
          transactionStatus: 'COMPLETED',
          amount,
        });

      this.prisma.$transaction([
        withDrawFromAccount,
        depositBalance,
        createTransferTransaction,
      ]);
    } catch (error) {
      // Create a new transaction record.
      await this.transactionsRepository.createTransaction({
        senderAccountId: fromAccountId,
        receiverAccountId: toAccountId,
        transactionType: 'TRANSFER',
        transactionStatus: 'FAILED',
        amount,
      });
      throw error;
    }
  }
}
