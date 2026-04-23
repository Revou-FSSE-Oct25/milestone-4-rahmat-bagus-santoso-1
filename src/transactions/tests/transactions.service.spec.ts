import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { TransactionsService } from '../transactions.service';
import { TransactionsRepository } from '../transactions.repository';
import {
  createTransactionAccountMock,
  createDepositDtoMock,
  createWithdrawDtoMock,
  createTransferDtoMock,
  createTransactionMock,
} from './mocks/transactions.mock';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockTransactionsRepository = {
    findAll: jest.fn(),
    findAllByUserId: jest.fn(),
    findById: jest.fn(),
    findAccountById: jest.fn(),
    createTransaction: jest.fn(),
    updateAccountBalance: jest.fn(),
    runInTransaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: mockTransactionsRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  mockTransactionsRepository.runInTransaction.mockImplementation(
    async (callback) => callback({}),
  );

  describe('deposit', () => {
    it('should deposit successfully', async () => {
      const userId = 1;
      const depositDto = createDepositDtoMock();
      const account = createTransactionAccountMock({
        id: 1,
        userId,
        balance: 100000,
      });
      const transaction = createTransactionMock({
        type: TransactionType.DEPOSIT,
        destinationAccountId: account.id,
        sourceAccountId: null,
        amount: depositDto.amount,
      });

      mockTransactionsRepository.findAccountById.mockResolvedValue(account);
      mockTransactionsRepository.runInTransaction.mockImplementation(
        async (callback) => callback({}),
      );
      mockTransactionsRepository.updateAccountBalance.mockResolvedValue(
        undefined,
      );
      mockTransactionsRepository.createTransaction.mockResolvedValue(
        transaction,
      );

      const result = await service.deposit(userId, depositDto);

      expect(result).toEqual(transaction);
      expect(
        mockTransactionsRepository.updateAccountBalance,
      ).toHaveBeenCalledWith(
        expect.anything(),
        account.id,
        account.balance + depositDto.amount,
      );
    });

    it('should throw ForbiddenException when depositing to another user account', async () => {
      const depositDto = createDepositDtoMock();
      const account = createTransactionAccountMock({ userId: 2 });

      mockTransactionsRepository.findAccountById.mockResolvedValue(account);

      await expect(service.deposit(1, depositDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('withdraw', () => {
    it('should throw BadRequestException when balance is insufficient', async () => {
      const withdrawDto = createWithdrawDtoMock({ amount: 200000 });
      const account = createTransactionAccountMock({
        userId: 1,
        balance: 100000,
      });

      mockTransactionsRepository.findAccountById.mockResolvedValue(account);

      await expect(service.withdraw(1, withdrawDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('transfer', () => {
    it('should throw BadRequestException when source and destination accounts are the same', async () => {
      const transferDto = createTransferDtoMock({
        sourceAccountId: 1,
        destinationAccountId: 1,
      });

      await expect(service.transfer(1, transferDto)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should throw ForbiddenException when source account does not belong to user', async () => {
      const transferDto = createTransferDtoMock();
      const sourceAccount = createTransactionAccountMock({
        id: 1,
        userId: 2,
        balance: 100000,
      });
      const destinationAccount = createTransactionAccountMock({
        id: 2,
        userId: 3,
        balance: 50000,
      });

      mockTransactionsRepository.findAccountById
        .mockResolvedValueOnce(sourceAccount)
        .mockResolvedValueOnce(destinationAccount);

      await expect(service.transfer(1, transferDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException when source account balance is insufficient', async () => {
      const transferDto = createTransferDtoMock({ amount: 200000 });
      const sourceAccount = createTransactionAccountMock({
        id: 1,
        userId: 1,
        balance: 100000,
      });
      const destinationAccount = createTransactionAccountMock({
        id: 2,
        userId: 2,
        balance: 50000,
      });

      mockTransactionsRepository.findAccountById
        .mockResolvedValueOnce(sourceAccount)
        .mockResolvedValueOnce(destinationAccount);

      await expect(service.transfer(1, transferDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should transfer successfully', async () => {
      const transferDto = createTransferDtoMock();
      const sourceAccount = createTransactionAccountMock({
        id: 1,
        userId: 1,
        balance: 100000,
      });
      const destinationAccount = createTransactionAccountMock({
        id: 2,
        userId: 2,
        balance: 50000,
      });
      const transaction = createTransactionMock({
        type: TransactionType.TRANSFER,
        sourceAccountId: 1,
        destinationAccountId: 2,
        amount: transferDto.amount,
      });

      mockTransactionsRepository.findAccountById
        .mockResolvedValueOnce(sourceAccount)
        .mockResolvedValueOnce(destinationAccount);
      mockTransactionsRepository.runInTransaction.mockImplementation(
        async (callback) => callback({}),
      );
      mockTransactionsRepository.updateAccountBalance.mockResolvedValue(
        undefined,
      );
      mockTransactionsRepository.createTransaction.mockResolvedValue(
        transaction,
      );

      const result = await service.transfer(1, transferDto);

      expect(result).toEqual(transaction);
      expect(
        mockTransactionsRepository.updateAccountBalance,
      ).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        sourceAccount.id,
        sourceAccount.balance - transferDto.amount,
      );
      expect(
        mockTransactionsRepository.updateAccountBalance,
      ).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        destinationAccount.id,
        destinationAccount.balance + transferDto.amount,
      );
    });
  });
});
