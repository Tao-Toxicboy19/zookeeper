import { IsNotEmpty, IsString } from 'class-validator'

export class KeyDto {
    @IsNotEmpty()
    @IsString()
    apiKey: string

    @IsNotEmpty()
    @IsString()
    secretKey: string
}
