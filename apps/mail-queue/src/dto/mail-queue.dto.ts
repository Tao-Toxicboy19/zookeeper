import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class MailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    message: string
}