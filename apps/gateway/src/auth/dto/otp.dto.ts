import { IsNumber, MaxLength, MinLength } from "class-validator";

export class OtpDto {
    @IsNumber()
    otp: number
}