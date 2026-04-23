import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import type { AuthenticatedRequest } from '../types/authenticated.request';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
@ApiBearerAuth('authBearer')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary: 'Create account for current user' })
  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(request.user.userId, createAccountDto);
  }

  @ApiOperation({ summary: 'Get account for current user'})
  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.accountsService.findAll(request.user.userId, request.user.role);
  }

  @ApiOperation({ summary: 'Get account detail' })
  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.accountsService.findOne(
      id,
      request.user.userId,
      request.user.role,
    );
  }

  @ApiOperation({ summary: 'update account' })
  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(
      id,
      request.user.userId,
      request.user.role,
      updateAccountDto,
    );
  }

  @ApiOperation({ summary: 'delete account' })
  @Delete(':id')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.accountsService.remove(
      id,
      request.user.userId,
      request.user.role,
    );
  }
}
