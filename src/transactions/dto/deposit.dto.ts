import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class DepositDto {
    @IsInt()
    accountId!: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    amount!: number;
}