import { IsNumber, Max, Min } from "class-validator";

export class OtpDto {
    @IsNumber()
    @Min(3)
    otp: number
}