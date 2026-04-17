import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class TransferDto {
    @IsInt()
    @IsNotEmpty()
    sourceAccountId!: number;

    @IsInt()
    @IsNotEmpty()
    destinationAccountId!: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    amount!: number;
}