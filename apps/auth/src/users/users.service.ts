import { Injectable } from '@nestjs/common'
import { UsersRepository } from './user.repository'
import { User } from './schemas/user.schemas'
import { UserDto } from './dto/user.dto'
import { MailResponse } from '@app/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(dto: UserDto): Promise<User> {
        try {
            return await this.usersRepository.create({
                _id: dto._id,
                email: dto.email,
                createdAt: new Date(),
                googleId: dto.googleId,
                name: dto.name,
                picture: dto.picture,
                username: dto.username || undefined,
                password: dto.password || undefined
            })
        } catch (error) {
            throw error
        }
    }

    async getEmail(userId: string): Promise<MailResponse> {
        try {
            const { email } = await this.usersRepository.findOne({
                _id: userId,
            })
            return { email }
        } catch (error) {
            throw error
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOne({ email })
    }

    async findOneByUsername(username: string): Promise<User> {
        return await this.usersRepository.findOne({ username })
    }

    async findOneById(userId: string): Promise<any> {
        return await this.usersRepository.findOne({ _id: userId })
    }

    async update({
        _id,
        resetPasswordToken,
        resetPasswordExpires,
        password,
    }: User): Promise<void> {
        await this.usersRepository.upsert(
            { _id },
            {
                resetPasswordToken,
                resetPasswordExpires,
                password,
            },
        )
    }

    findOneByResetPasswordToken(token: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ resetPasswordToken: token })
    }
}
