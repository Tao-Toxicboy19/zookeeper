import {
    ConfirmOTPDto,
    EmailResponse,
    GoogleLoginDto,
    JwtPayload,
    RedisService,
    SigninDto,
    TokenResponse,
    Tokens,
    UserResponse,
    ValidateDto,
} from '@app/common'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ProducerService } from './producer/producer.service'
import * as bcrypt from 'bcrypt'
import { UsersService } from './users/users.service'
import { ObjectId } from 'mongodb'
import {
    GrpcAlreadyExistsException,
    GrpcInvalidArgumentException,
    GrpcNotFoundException,
} from 'nestjs-grpc-exceptions'
import { randomUUID } from 'crypto'
import { UserDto } from './users/dto/user.dto'
import { Types } from 'mongoose'

@Injectable()
export class AuthService implements OnModuleInit {
    private readonly logger = new Logger(AuthService.name)
    private readonly otpMailQueue: string = 'otp_mail_queue'
    private readonly resetPassswordQueue: string = 'reset_password_queue'

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly producerService: ProducerService,
        private readonly redisService: RedisService,
        private readonly userService: UsersService,
    ) {}

    onModuleInit() {}

    async validateUser(dto: ValidateDto): Promise<UserResponse> {
        const user = await this.userService.findOneByUsername(dto.username)
        if (user && (await bcrypt.compare(dto.password, user.password))) {
            return {
                username: user.username,
                sub: new ObjectId(user._id).toHexString(),
            }
        }
    }

    async signin(dto: SigninDto): Promise<EmailResponse> {
        try {
            const user = await this.userService.findOneByUsername(dto.username)
            await this.producerService.handleSendTask(
                this.otpMailQueue,
                JSON.stringify(user),
            )
            return {
                email: user.email,
            }
        } catch (error) {
            throw error
        }
    }

    async signup(dto: UserDto): Promise<EmailResponse> {
        try {
            const existUser = await this.userService.findOneByUsername(
                dto.username,
            )
            const userInRedis = await this.redisService.getValue(dto.name)
            const existEmail = await this.userService.findOneByEmail(dto.email)
            if (existEmail || userInRedis) {
                throw new GrpcAlreadyExistsException('Email already exists.')
            } else if (existUser) {
                throw new GrpcAlreadyExistsException('User already exists.')
            }

            if (dto.googleId) {
                const user = await this.userService.createUser(dto)

                return {
                    email: dto.email,
                    userId: new ObjectId(user._id).toHexString(),
                }
            }
            const _id: Types.ObjectId = new Types.ObjectId()

            const userCache: string = JSON.stringify({
                ...dto,
                _id,
                password: await bcrypt.hash(dto.password, 12),
            })

            await this.producerService.handleSendTask(
                this.otpMailQueue,
                userCache,
            )

            // cacheing in redis
            await this.redisService.setKey(dto.username, 600, userCache)
            return {
                email: dto.email,
                userId: new ObjectId(_id).toHexString(),
            }
        } catch (error) {
            throw error
        }
    }

    async confrimOTP(dto: ConfirmOTPDto): Promise<TokenResponse> {
        try {
            const user = JSON.parse(
                await this.redisService.getValue(dto.userId),
            )
            if (!user) {
                throw new GrpcNotFoundException('User not found.')
            }

            if (dto.otp !== user.otp) {
                throw new GrpcInvalidArgumentException('OTP invalid.')
            }

            const userCache: UserDto = JSON.parse(
                await this.redisService.getValue(user.user.username),
            )

            // create user
            if (userCache) {
                await this.userService.createUser(userCache)
            }

            const { accessToken, refreshToken } = await this.getTokens(
                dto.userId,
                user.user.username,
            )

            await Promise.all([
                this.redisService.deleteKey(dto.userId),
                this.redisService.deleteKey(user.user.username),
            ])
            return {
                accessToken,
                refreshToken,
            }
        } catch (error) {
            throw error
        }
    }

    async googleLogin(dto: GoogleLoginDto): Promise<TokenResponse> {
        const user = await this.userService.findOneByEmail(dto.email)
        if (user) {
            const { accessToken, refreshToken } = await this.getTokens(
                new ObjectId(user._id).toHexString(),
                user.email,
            )
            return {
                accessToken,
                refreshToken,
            }
        }
        const _id: Types.ObjectId = new Types.ObjectId()
        const { email, userId } = await this.signup({
            _id,
            email: dto.email,
            name: dto.name,
            picture: dto.picture,
            username: dto.email,
            googleId: dto.googleId,
        })

        const { accessToken, refreshToken } = await this.getTokens(
            userId,
            email,
        )

        return {
            accessToken,
            refreshToken,
        }
    }

    async refreshToken(user: JwtPayload): Promise<Tokens> {
        try {
            const tokens = await this.getTokens(user.sub, user.username)

            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            }
        } catch (error) {
            throw error
        }
    }

    async getTokens(userId: string, username: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            sub: userId,
            username: username,
        }

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('AT_SECRET'),
                expiresIn: '1d',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('RT_SECRET'),
                expiresIn: '7d',
            }),
        ])

        return {
            accessToken: at,
            refreshToken: rt,
        }
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userService.findOneByEmail(email)
        if (!user) {
            throw new GrpcNotFoundException('User not found')
        }

        const token = randomUUID()
        user.resetPasswordToken = token
        user.resetPasswordExpires = new Date(Date.now() + 3600000)
        await this.userService.update(user)

        // send mail
        const payload = {
            token,
            email: user.email,
        }
        await this.producerService.handleSendTask(
            this.resetPassswordQueue,
            JSON.stringify(payload),
        )
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await this.userService.findOneByResetPasswordToken(token)
        if (!user || user.resetPasswordExpires < new Date()) {
            throw new GrpcInvalidArgumentException(
                'Password reset token is invalid or has expired',
            )
        }

        user.password = await bcrypt.hash(newPassword, 12)
        user.resetPasswordToken = null
        user.resetPasswordExpires = null
        await this.userService.update(user)
    }
}
