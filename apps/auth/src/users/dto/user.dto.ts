import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class UserDto {
    @IsObjectId()
    @IsOptional()
    _id?: Types.ObjectId

    @IsString()
    @IsOptional()
    username?: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsOptional()
    password?: string

    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    picture?: string

    @IsString()
    @IsOptional()
    googleId?: string
}
function IsObjectId(): (target: UserDto, propertyKey: '_id') => void {
    throw new Error('Function not implemented.')
}
