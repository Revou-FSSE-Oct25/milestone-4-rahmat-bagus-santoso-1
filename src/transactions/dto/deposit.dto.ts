import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, Min } from "class-validator";

export class DepositDto {
    @ApiProperty({ description: 'Account ID' })
    @IsInt()
    accountId!: number;

    @ApiProperty({ description: 'Deposit amount' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @Min(50000)
    amount!: number;
}