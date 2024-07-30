import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class MailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    symbol: string

    @IsString()
    @IsNumber()
    leverage: number

    @IsString()
    @IsNumber()
    quantity: number
}