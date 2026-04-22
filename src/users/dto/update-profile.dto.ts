import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    fullName?: string;

    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password?: string;
}
