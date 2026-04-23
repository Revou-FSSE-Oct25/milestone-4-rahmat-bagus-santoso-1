import { AccountStatus, AccountType } from '@prisma/client';
import { CreateAccountDto } from '../../dto/create-account.dto';
import { UpdateAccountDto } from '../../dto/update-account.dto';

export function createAccountMock(overrides = {}) {
  return {
    id: 1,
    accountNumber: '1012345678',
    balance: 0,
    type: AccountType.SAVINGS,
    status: AccountStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
    ...overrides,
  };
}

export function createCreateAccountDtoMock(
  overrides: Partial<CreateAccountDto> = {},
): CreateAccountDto {
  return {
    type: AccountType.SAVINGS,
    ...overrides,
  };
}

export function createUpdateAccountDtoMock(
  overrides: Partial<UpdateAccountDto> = {},
): UpdateAccountDto {
  return {
    status: AccountStatus.BLOCKED,
    ...overrides,
  };
}
