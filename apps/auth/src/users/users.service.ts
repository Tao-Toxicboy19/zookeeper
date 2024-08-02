import { Injectable } from '@nestjs/common'
import { UsersRepository } from './user.repository'
import { User } from './schemas/user.schemas'
import { UserDto } from './dto/user.dto'
import { EmailResponse, MailResponse } from '@app/common'
import * as bcrypt from 'bcrypt'
import { ProducerService } from '../producer/producer.service'
import { GrpcAlreadyExistsException } from 'nestjs-grpc-exceptions'
import { ObjectId } from 'mongodb'

@Injectable()
export class UsersService {
    private readonly otpMailQueue: string = 'otp_mail_queue'
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly producerService: ProducerService,
    ) { }

    async createUser(dto: UserDto): Promise<User> {
        try {
            let hash: string | undefined
            if (dto.password) {
                hash = await bcrypt.hash(dto.password, 12)
            }

            return await this.usersRepository.create({
                username: dto.googleId ? dto.email : dto.username,
                email: dto.email,
                password: hash,
                createdAt: new Date(),
                googleId: dto.googleId,
                name: dto.name,
                picture: dto.picture,
            })
        } catch (error) {
            throw error
        }
    }

    async getEmail(userId: string): Promise<MailResponse> {
        try {
            const { email } = await this.usersRepository.findOne({ _id: userId })
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

    async update({ _id, resetPasswordToken, resetPasswordExpires, password }: User): Promise<void> {
        await this.usersRepository.upsert({ _id }, {
            resetPasswordToken,
            resetPasswordExpires,
            password
        })
    }

    findOneByResetPasswordToken(token: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ resetPasswordToken: token })
    }
}
