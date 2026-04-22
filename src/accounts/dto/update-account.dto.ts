import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AccountStatus } from '@prisma/client';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
    @ApiProperty({ description: 'Updated status of the account' })
    @IsOptional()
    @IsEnum(AccountStatus)
    status?: AccountStatus;
}
