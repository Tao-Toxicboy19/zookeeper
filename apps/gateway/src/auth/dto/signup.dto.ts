import { IsEmail, IsString, MinLength } from "class-validator";

export class SignupDto {
    @IsString()
    @MinLength(6)
    username: string

    @IsString()
    @MinLength(8)
    password: string

    @IsEmail()
    email: string
}