import { Injectable, NotFoundException } from '@nestjs/common';
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


  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const data: Prisma.AccountCreateInput = {
      accountNumber: createAccountDto.accountNumber,
      user: {
        connect: {
          id: createAccountDto.userId,
        },
      },
    };
    return this.accountsRepository.create(data);
    // return this.accountsRepository.create(
    //   this.mapCreateDtoToPrisma(createAccountDto)
    // )
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
}
