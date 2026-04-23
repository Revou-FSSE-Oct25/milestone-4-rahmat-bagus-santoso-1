import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AccountStatus, AccountType, Role } from '@prisma/client';
import { AccountsService } from '../accounts.service';
import { AccountsRepository } from '../accounts.repository';
import {
  createAccountMock,
  createCreateAccountDtoMock,
  createUpdateAccountDtoMock,
} from './mocks/accounts.mock';

describe('AccountsService', () => {
  let service: AccountsService;

  const mockAccountsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByUserId: jest.fn(),
    findById: jest.fn(),
    findByAccountNumber: jest.fn(),
    update: jest.fn(),
    hasTransactions: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: AccountsRepository,
          useValue: mockAccountsRepository,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  describe('create', () => {
    it('should create account successfully', async () => {
      const userId = 1;
      const createDto = createCreateAccountDtoMock({
        type: AccountType.CHECKING,
      });
      const account = createAccountMock({ userId, type: AccountType.CHECKING });

      mockAccountsRepository.findByAccountNumber.mockResolvedValue(null);
      mockAccountsRepository.create.mockResolvedValue(account);

      const result = await service.create(userId, createDto);

      expect(result).toEqual(account);
      expect(mockAccountsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: AccountType.CHECKING,
          user: {
            connect: {
              id: userId,
            },
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when account is not found', async () => {
      mockAccountsRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(1, 1, Role.CUSTOMER)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user accesses another user account', async () => {
      const account = createAccountMock({ userId: 2 });

      mockAccountsRepository.findById.mockResolvedValue(account);

      await expect(service.findOne(1, 1, Role.CUSTOMER)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException when user updates another user account', async () => {
      const account = createAccountMock({ userId: 2 });
      const updateDto = createUpdateAccountDtoMock();

      mockAccountsRepository.findById.mockResolvedValue(account);

      await expect(
        service.update(1, 1, Role.CUSTOMER, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should throw ConflictException when account balance is greater than zero', async () => {
      const account = createAccountMock({ balance: 50000, userId: 1 });

      mockAccountsRepository.findById.mockResolvedValue(account);

      await expect(service.remove(1, 1, Role.CUSTOMER)).rejects.toThrow(
        ConflictException,
      );
      expect(mockAccountsRepository.hasTransactions).not.toHaveBeenCalled();
      expect(mockAccountsRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when account has transactions', async () => {
      const account = createAccountMock({ balance: 0, userId: 1 });

      mockAccountsRepository.findById.mockResolvedValue(account);
      mockAccountsRepository.hasTransactions.mockResolvedValue(true);

      await expect(service.remove(1, 1, Role.CUSTOMER)).rejects.toThrow(
        ConflictException,
      );
      expect(mockAccountsRepository.remove).not.toHaveBeenCalled();
    });

    it('should remove account successfully when balance is zero and no transactions exist', async () => {
      const account = createAccountMock({ balance: 0, userId: 1 });

      mockAccountsRepository.findById.mockResolvedValue(account);
      mockAccountsRepository.hasTransactions.mockResolvedValue(false);
      mockAccountsRepository.remove.mockResolvedValue(account);

      const result = await service.remove(1, 1, Role.CUSTOMER);

      expect(result).toEqual(account);
      expect(mockAccountsRepository.remove).toHaveBeenCalledWith(account.id);
    });
  });
});
