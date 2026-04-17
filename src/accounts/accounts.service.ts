import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor (
    private readonly accountsRepository: AccountsRepository
  ) {}


  async create(userId: number, _createAccountDto: CreateAccountDto): Promise<Account> {
    const existingUser = await this.accountsRepository.findByUserId(userId);

    if(existingUser) {
      throw new ConflictException('User already has an account');
    }

    const accountNumber = await this.generateUniqueAccountNumber();

    const data: Prisma.AccountCreateInput = {
      accountNumber,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return this.accountsRepository.create(data);
  }

  async findAll(): Promise<Account[]> {
    return this.accountsRepository.findAll();
  }

  async findOne(id: number): Promise<Account> {
    const account = await this.accountsRepository.findById(id);

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  // async update(id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
  //   const data: Prisma.AccountUpdateInput = {};

  //   if (updateAccountDto.accountNumber !== undefined ) {
  //     data.accountNumber = updateAccountDto.accountNumber;
  //   }

  //   if (updateAccountDto.userId !== undefined ) {
  //     data.user = 
  //   }
  //   return 
  // }

  remove(id: number) {
    return `This action removes a #${id} account`;
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
    const randomDigits = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(8, '0');

    return `${prefix}${randomDigits}`;
  }
}
