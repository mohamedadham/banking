import { UsersRepository } from './../users/users.repository';
import { TwilioService } from './../integrations/sms.integrations';
import {
  AccountType,
  Prisma,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { PrismaService } from './../../prisma/prisma.service';
import { Transaction } from '@prisma/client';
import { NotFoundError } from './../../src/errors/custom-errors';

jest.mock('./../integrations/sms.integrations');

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  let transactionsRepository: TransactionsRepository;
  let accountsRepository: AccountsRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        TransactionsRepository,
        AccountsRepository,
        PrismaService,
        UsersRepository,
        TwilioService,
      ],
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<TransactionsRepository>(
      TransactionsRepository,
    );
    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAllTransactions', () => {
    it('should return an array of transactions', async () => {
      const result: Transaction[] = [
        {
          id: 1,
          amount: new Prisma.Decimal('09.0987'),
          transactionType: TransactionType.DEPOSIT,
          createdAt: new Date(),
          updatedAt: new Date(),
          senderAccountId: 1,
          receiverAccountId: 1,
          transactionStatus: TransactionStatus.PENDING,
        },
      ];

      jest
        .spyOn(transactionsRepository, 'getAllTransactions')
        .mockResolvedValue(result);

      expect(await transactionsService.getAllTransactions()).toEqual(result);
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by ID', async () => {
      const transactionId = 1;
      const result: Transaction | null = {
        id: 1,
        amount: new Prisma.Decimal('09.0987'),
        transactionType: TransactionType.DEPOSIT,
        createdAt: new Date(),
        updatedAt: new Date(),
        senderAccountId: 1,
        receiverAccountId: 1,
        transactionStatus: TransactionStatus.PENDING,
      };
      jest
        .spyOn(transactionsRepository, 'getTransactionById')
        .mockResolvedValue(result);

      expect(
        await transactionsService.getTransactionById(transactionId),
      ).toEqual(result);
    });
  });

  describe('transfer', () => {
    it('should transfer funds between accounts successfully', async () => {
      // Arrange
      const fromAccountId = 1;
      const toAccountId = 2;
      const amount = 100;

      const fromAccount = {
        id: fromAccountId,
        balance: new Prisma.Decimal(200),
        userId: 1,
        accountType: AccountType.CURRENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountNumber: '1234567890',
      };

      const toAccount = {
        id: toAccountId,
        balance: new Prisma.Decimal(200),
        userId: 5,
        accountType: AccountType.CURRENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountNumber: '1234567891',
      };

      const updatedFromAccount = {
        id: fromAccountId,
        balance: new Prisma.Decimal(100),
        userId: 1,
        accountType: AccountType.CURRENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountNumber: '1234567890',
      };

      const updatedToAccount = {
        id: fromAccountId,
        balance: new Prisma.Decimal(100),
        userId: 1,
        accountType: AccountType.CURRENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountNumber: '1234567890',
      };

      const transaction = {
        id: 1,
        amount: new Prisma.Decimal(100),
        transactionType: TransactionType.TRANSFER,
        createdAt: new Date(),
        updatedAt: new Date(),
        senderAccountId: fromAccountId,
        receiverAccountId: toAccountId,
        transactionStatus: TransactionStatus.PENDING,
      };

      jest
        .spyOn(accountsRepository, 'getAccountById')
        .mockResolvedValueOnce(fromAccount)
        .mockResolvedValueOnce(toAccount);

      jest
        .spyOn(accountsRepository, 'updateBalance')
        .mockResolvedValueOnce(updatedFromAccount) // for fromAccount
        .mockResolvedValueOnce(updatedToAccount); // for toAccount

      jest
        .spyOn(transactionsRepository, 'createTransaction')
        .mockResolvedValueOnce(transaction); // for createTransferTransaction

      jest.spyOn(prismaService, '$transaction').mockResolvedValueOnce({});

      // Act
      await transactionsService.transfer(fromAccountId, toAccountId, amount);

      // Assert
      expect(accountsRepository.getAccountById).toHaveBeenCalledWith(
        fromAccountId,
      );
      expect(accountsRepository.getAccountById).toHaveBeenCalledWith(
        toAccountId,
      );
      expect(accountsRepository.updateBalance).toHaveBeenCalledWith(
        fromAccountId,
        100,
      );
      expect(accountsRepository.updateBalance).toHaveBeenCalledWith(
        toAccountId,
        300,
      );
      expect(transactionsRepository.createTransaction).toHaveBeenCalledWith({
        senderAccountId: fromAccountId,
        receiverAccountId: toAccountId,
        transactionType: 'TRANSFER',
        transactionStatus: 'COMPLETED',
        amount,
      });
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundError if the fromAccount does not exist', async () => {
      // Arrange
      const fromAccountId = 1;
      const toAccountId = 2;
      const amount = 100;

      jest
        .spyOn(accountsRepository, 'getAccountById')
        .mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        transactionsService.transfer(fromAccountId, toAccountId, amount),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
