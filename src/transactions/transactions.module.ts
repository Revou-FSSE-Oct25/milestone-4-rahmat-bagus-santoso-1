import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TransactionsController],
  providers: [PrismaService, TransactionsRepository, TransactionsService],
})
export class TransactionsModule {}
