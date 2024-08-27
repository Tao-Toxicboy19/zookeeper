import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class createLimitOrderDto {
    @IsNotEmpty()
    @IsString()
    symbol: string

    @IsNotEmpty()
    @IsNumber()
    leverage: number

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @IsNotEmpty()
    @IsString()
    userId: string

    @IsOptional()
    @IsString()
    position?: string
}
