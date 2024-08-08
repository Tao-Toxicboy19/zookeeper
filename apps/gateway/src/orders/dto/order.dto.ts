import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class OrderDto {
    @IsNotEmpty()
    @IsString()
    symbol: string

    @IsNotEmpty()
    @IsInt()
    leverage: number

    @IsNotEmpty()
    @IsInt()
    quantity: number

    @IsNotEmpty()
    @IsString()
    timeframe: string

    @IsOptional()
    @IsInt()
    ema: number

    @IsNotEmpty()
    @IsString()
    type: string

    @IsOptional()
    @IsString()
    userId: string
}
