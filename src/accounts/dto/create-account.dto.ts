import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class CreateAccountDto {
    @ApiProperty()
    @IsOptional()
    @IsEnum(AccountType)
    type?: AccountType;
}
