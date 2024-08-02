import { IsNumber, Max, Min } from "class-validator";

export class OtpDto {
    @IsNumber()
    @Min(4)
    @Max(4)
    otp: number
}