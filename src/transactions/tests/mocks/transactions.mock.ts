import {
  AccountStatus,
  AccountType,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { DepositDto } from '../../dto/deposit.dto';
import { WithdrawDto } from '../../dto/withdraw.dto';
import { TransferDto } from '../../dto/transfer.dto';

export function createTransactionAccountMock(overrides = {}) {
  return {
    id: 1,
    accountNumber: '1012345678',
    balance: 100000,
    type: AccountType.SAVINGS,
    status: AccountStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
    ...overrides,
  };
}

export function createDepositDtoMock(
  overrides: Partial<DepositDto> = {},
): DepositDto {
  return {
    accountId: 1,
    amount: 50000,
    ...overrides,
  };
}

export function createWithdrawDtoMock(
  overrides: Partial<WithdrawDto> = {},
): WithdrawDto {
  return {
    accountId: 1,
    amount: 50000,
    ...overrides,
  };
}

export function createTransferDtoMock(
  overrides: Partial<TransferDto> = {},
): TransferDto {
  return {
    sourceAccountId: 1,
    destinationAccountId: 2,
    amount: 10000,
    ...overrides,
  };
}

export function createTransactionMock(overrides = {}) {
  return {
    id: 1,
    type: TransactionType.DEPOSIT,
    amount: 50000,
    description: null,
    status: TransactionStatus.COMPLETED,
    createdAt: new Date(),
    updatedAt: new Date(),
    sourceAccountId: null,
    destinationAccountId: 1,
    ...overrides,
  };
}
