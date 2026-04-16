import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [PasswordModule],
  controllers: [UsersController],
  providers: [PrismaService, UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
