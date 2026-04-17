import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class WithdrawDto {
    @IsInt()
    accountId!: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    amount!: number;
}