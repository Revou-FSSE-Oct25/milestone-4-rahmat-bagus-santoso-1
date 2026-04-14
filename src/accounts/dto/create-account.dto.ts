import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    accountNumber!: string;

    @IsInt()
    userId!: number;
}
