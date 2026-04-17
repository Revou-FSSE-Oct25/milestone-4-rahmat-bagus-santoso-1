import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { DepositDto } from './dto/deposit.dto';
import { Transaction } from './entities/transaction.entity';
import { AccountStatus, Role, TransactionStatus, TransactionType } from '@prisma/client';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async deposit(userId: number, depositDto: DepositDto): Promise<Transaction> {
    const account = await this.transactionsRepository.findAccountById(
      depositDto.accountId,
    );

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You cannot deposit to this account');
    }

    this.validateAccountStatus(account.status);

    return this.transactionsRepository.runInTransaction(async (tx) => {
      const updatedbalance = account.balance + depositDto.amount;

      await this.transactionsRepository.updateAccountBalance(
        tx,
        account.id,
        updatedbalance,
      );

      return this.transactionsRepository.createTransaction(tx, {
        type: TransactionType.DEPOSIT,
        amount: depositDto.amount,
        status: TransactionStatus.COMPLETED,
        destinationAccount: {
          connect: {
            id: account.id,
          },
        },
      });
    });
  }

  async withdraw(
    userId: number,
    withdrawDto: WithdrawDto,
  ): Promise<Transaction> {
    const account = await this.transactionsRepository.findAccountById(
      withdrawDto.accountId,
    );

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You cannot withdraw from this account');
    }

    this.validateAccountStatus(account.status);

    if (account.balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.transactionsRepository.runInTransaction(async (tx) => {
      const updatedbalance = account.balance - withdrawDto.amount;

      await this.transactionsRepository.updateAccountBalance(
        tx,
        account.id,
        updatedbalance,
      );

      return this.transactionsRepository.createTransaction(tx, {
        type: TransactionType.WITHDRAW,
        amount: withdrawDto.amount,
        status: TransactionStatus.COMPLETED,
        sourceAccount: {
          connect: {
            id: account.id,
          },
        },
      });
    });
  }

  async transfer(userId: number, transferDto: TransferDto): Promise<Transaction> {
    if (transferDto.sourceAccountId === transferDto.destinationAccountId) {
      throw new BadRequestException(
        'Source account and destination account must be different',
      );
    }

    const sourceAccount = await this.transactionsRepository.findAccountById(
      transferDto.sourceAccountId,
    );

    const destinationAccount = await this.transactionsRepository.findAccountById(
      transferDto.destinationAccountId,
    );

    if(!sourceAccount) {
      throw new NotFoundException(
        'Source account not found'
      );
    }

    if(!destinationAccount) {
      throw new NotFoundException(
        'Destination account not found'
      );
    }

    if(sourceAccount.userId !== userId) {
      throw new ForbiddenException(
        'You cannot transfer from this source account'
      );
    }

    this.validateAccountStatus(sourceAccount.status);
    this.validateAccountStatus(destinationAccount.status);

    if (sourceAccount.balance < transferDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.transactionsRepository.runInTransaction(async (tx) => {
      await this.transactionsRepository.updateAccountBalance(
        tx,
        sourceAccount.id,
        sourceAccount.balance - transferDto.amount,
      );

      await this.transactionsRepository.updateAccountBalance(
        tx,
        destinationAccount.id,
        destinationAccount.balance + transferDto.amount,
      );

      return this.transactionsRepository.createTransaction(tx, {
        type: TransactionType.TRANSFER,
        amount: transferDto.amount,
        status: TransactionStatus.COMPLETED,
        sourceAccount: {
          connect: {
            id: sourceAccount.id,
          },
        },
        destinationAccount: {
          connect: {
            id: destinationAccount.id,
          },
        },
      });
    });
  }

  async findAll(userId: number, role: Role) {
    if (role === Role.ADMIN) {
      return this.transactionsRepository.findAll();
    }
    return this.transactionsRepository.findAllByUserId(userId);
  }

  async findOne(id: number, userId: number, role: Role) {
    const transaction = await this.transactionsRepository.findById(id);

    if(!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (role === Role.ADMIN) {
      return transaction;
    }

    const isOwner = transaction.sourceAccount?.userId === userId ||
    transaction.destinationAccount?.userId === userId;

    if(!isOwner) {
      throw new ForbiddenException('Forbidden access');
    }

    return transaction;
  }

  private validateAccountStatus(status: AccountStatus): void {
    if (status === AccountStatus.BLOCKED) {
      throw new BadRequestException('Account withis blocked');
    }

    if (status === AccountStatus.DELETED) {
      throw new BadRequestException('Account is deleted');
    }
  }
}
