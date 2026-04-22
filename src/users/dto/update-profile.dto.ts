import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDTO {
    @ApiProperty({ description: 'Updated full name of the current user' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    fullName?: string;

    @ApiProperty({ description: 'Updated email address of the current user' })
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @ApiProperty({ description: 'Updated password of the current user' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password?: string;
}
