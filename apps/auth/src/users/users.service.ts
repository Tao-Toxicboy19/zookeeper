import { Injectable } from '@nestjs/common'
import { UsersRepository } from './user.repository'
import { User } from './schemas/user.schemas'
import { UserDto } from './dto/user.dto'
import { EmailResponse } from '@app/common'
import * as bcrypt from 'bcrypt'
import { ProducerService } from '../producer/producer.service'
import { GrpcAlreadyExistsException, GrpcInternalException } from 'nestjs-grpc-exceptions'
import { ObjectId } from 'mongodb'

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly producerService: ProducerService,
    ) { }

    async signup(dto: UserDto): Promise<EmailResponse> {
        try {
            const existUser = await this.validateUser(dto.username)
            console.log(existUser)
            const existEmail = await this.validateEmail(dto.email)
            if (existUser) {
                throw new GrpcAlreadyExistsException('User already exists.')
            } else if (existEmail) {
                throw new GrpcAlreadyExistsException('Email already exists.')
            }

            const hash = await bcrypt.hash(dto.password, 12)
            const user = await this.usersRepository.create({
                username: dto.username,
                email: dto.email,
                password: hash,
                createdAt: new Date()
            })

            await this.producerService.sendMsg(JSON.stringify(user))

            return {
                email: dto.email,
                userId: new ObjectId(user._id).toHexString()
            }
        } catch (error) {
            throw error
        }
    }

    async getEmail(userId: string){
        try {
            const { email } = await this.usersRepository.findOne({ _id: userId })
            return { email }
        } catch (error) {
            throw error
        }
    }

    private async validateEmail(email: string) {
        return await this.usersRepository.findOne({ email })
    }

    async validateUser(username: string): Promise<User> {
        return await this.usersRepository.findOne({ username })
    }
}
