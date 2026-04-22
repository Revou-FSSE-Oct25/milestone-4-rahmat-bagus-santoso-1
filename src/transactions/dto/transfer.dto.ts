import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, Min } from "class-validator";

export class TransferDto {
    @ApiProperty({ description: 'source account ID' })
    @IsInt()
    @IsNotEmpty()
    sourceAccountId!: number;

    @ApiProperty({ description: 'destination account ID' })
    @IsInt()
    @IsNotEmpty()
    destinationAccountId!: number;

    @ApiProperty({  example: 10000, description: 'transfer amount' })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @Min(10000)
    amount!: number;
}