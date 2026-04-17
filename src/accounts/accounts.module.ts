import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsRepository } from './accounts.repository';


@Module({
  controllers: [AccountsController],
  providers: [PrismaService, AccountsRepository, AccountsService],
})
export class AccountsModule {}
