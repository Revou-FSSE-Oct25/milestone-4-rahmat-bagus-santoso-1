import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import type { AuthenticatedRequest } from 'src/types/authenticated.request';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(
    @Req() request: AuthenticatedRequest,
    @Body() depositDto: DepositDto,
  ) {
    return this.transactionsService.deposit(request.user.userId, depositDto);
  }

  @Post('withdraw')
  withdraw(
    @Req() request: AuthenticatedRequest,
    @Body() withdrawDto: WithdrawDto,
  ) {
    return this.transactionsService.withdraw(request.user.userId, withdrawDto);
  }

  @Post('transfer')
  transfer(
    @Req() request: AuthenticatedRequest,
    @Body() transferDto: TransferDto,
  ) {
    return this.transactionsService.transfer(request.user.userId, transferDto);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.transactionsService.findAll(
      request.user.userId,
      request.user.role,
    );
  }

  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionsService.findOne(
      id,
      request.user.userId,
      request.user.role,
    )
  }
}
