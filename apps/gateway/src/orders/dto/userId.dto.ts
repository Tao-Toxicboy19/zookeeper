import { IsNotEmpty, IsString } from 'class-validator'

export class UserIdDto {
    @IsNotEmpty()
    @IsString()
    user_id: string
}
