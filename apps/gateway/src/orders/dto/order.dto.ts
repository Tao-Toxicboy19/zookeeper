import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsEnum,
} from 'class-validator'

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

    @IsOptional()
    @IsString()
    timeframe: string

    @IsOptional()
    @IsInt()
    ema: number

    @IsNotEmpty()
    @IsEnum(['EMA', 'AI'], {
        message: 'status must be either "EMA" or "AI"',
    })
    type: 'EMA' | 'AI'

    @IsOptional()
    @IsString()
    userId: string

    @IsOptional()
    @IsEnum(['Short', 'Long'], {
        message: 'status must be either "Short" or "Long"',
    })
    status?: 'Short' | 'Long'
}
