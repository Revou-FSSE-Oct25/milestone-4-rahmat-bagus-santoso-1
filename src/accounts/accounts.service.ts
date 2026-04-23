import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountType, Prisma, Role } from '@prisma/client';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor (
    private readonly accountsRepository: AccountsRepository
  ) {}


  async create(userId: number, createAccountDto: CreateAccountDto): Promise<Account> {
    const accountNumber = await this.generateUniqueAccountNumber();

    const data: Prisma.AccountCreateInput = {
      accountNumber,
      type: createAccountDto.type ?? AccountType.SAVINGS,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return this.accountsRepository.create(data);
  }

  async findAll(userId: number, role: Role): Promise<Account[]> {
    if (role == Role.ADMIN) {
      return this.accountsRepository.findAll();
    }
    return this.accountsRepository.findAllByUserId(userId);
  }

  async findOne(id: number, userId: number, role: Role): Promise<Account> {
    const account = await this.accountsRepository.findById(id);

    if (!account) {
      throw new NotFoundException(`Account not found for this user`);
    }

    if (role !== Role.ADMIN && account.userId !== userId) {
      throw new ForbiddenException('You cannot access this account');
    }

    return account;
  }

  async update(id: number, userId: number, role: Role, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const account = await this.accountsRepository.findById(id);

    if(!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    if (role !== Role.ADMIN && account.userId !== userId) {
      throw new ForbiddenException('You can only update your own account');
    }

    const data: Prisma.AccountUpdateInput = {};

    if (updateAccountDto.status !== undefined ) {
      data.status = updateAccountDto.status;
    }

    return this.accountsRepository.update(account.id, data);
  }

  async remove(id: number, userId: number, role: Role): Promise<Account> {
    const account = await this.accountsRepository.findById(id);

    if(!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    if (role !== Role.ADMIN && account.userId !== userId) {
      throw new ForbiddenException('You can only delete your own account');
    }
    
    if (account.balance > 0) {
      throw new ConflictException('Account with balance cannot be deleted');
    }

    const hasTransactions = await this.accountsRepository.hasTransactions(id);
    
    if(hasTransactions) {
      throw new ConflictException('Account with transactions cannot be deleted');
    }
    return this.accountsRepository.remove(account.id);
  }

  private async generateUniqueAccountNumber(): Promise<string> {
    while (true) {
      const accountNumber= this.generateAccountNumber();

      const existingAccount = await this.accountsRepository.findByAccountNumber(accountNumber);

      if(!existingAccount) {
        return accountNumber;
      }
    }
  }

  private generateAccountNumber(): string {
    const prefix = '10';
    const randomDigits = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, '0');

    return `${prefix}${randomDigits}`;
  }
}
