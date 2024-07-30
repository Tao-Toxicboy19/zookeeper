import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
    @IsString()
    @IsOptional()
    username?: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsOptional()
    password?: string

    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    picture?: string

    @IsString()
    @IsOptional()
    googleId?: string
}