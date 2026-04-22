import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, Min } from "class-validator";

export class WithdrawDto {
    @ApiProperty({ description: 'Account ID' })
    @IsInt()
    accountId!: number;

    @ApiProperty({  example: 50000, description: 'withdraw amount' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @Min(50000)
    amount!: number;
}
