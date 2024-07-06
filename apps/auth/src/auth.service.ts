import {
  ConfirmOTPDto,
  EmailResponse,
  JwtPayload,
  RedisService,
  SigninDto,
  TokenResponse,
  Tokens,
  UserResponse,
  ValidateDto
} from '@app/common'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ProducerService } from './producer/producer.service'
import * as bcrypt from 'bcrypt'
import { UsersService } from './users/users.service'
import { ObjectId } from 'mongodb'
import {
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcUnauthenticatedException
} from 'nestjs-grpc-exceptions'

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly producerService: ProducerService,
    private readonly redisService: RedisService,
    private readonly userService: UsersService,
  ) { }

  onModuleInit() { }

  async validateUser(dto: ValidateDto): Promise<UserResponse> {
    const user = await this.userService.validateUser(dto.username)
    if (user && await bcrypt.compare(dto.password, user.password)) {
      return {
        username: user.username,
        sub: new ObjectId(user._id).toHexString()
      }
    }
    throw new GrpcUnauthenticatedException('User not found.')
  }

  async signin(dto: SigninDto): Promise<EmailResponse> {
    try {
      const user = await this.userService.validateUser(dto.username)
      await this.producerService.sendMsg('mail', JSON.stringify(user))
      return {
        email: user.email
      }
    } catch (error) {
      throw error
    }
  }

  async confrimOTP(dto: ConfirmOTPDto): Promise<TokenResponse> {
    try {
      const user = JSON.parse(await this.redisService.getValue(dto.userId))
      if (!user) throw new GrpcNotFoundException('User not found.')

      if (dto.otp !== user.otp) throw new GrpcInvalidArgumentException('OTP invalid.')

      const tokens = await this.getTokens(dto.userId, user.user.username)
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    } catch (error) {
      throw error
    }
  }

  async refreshToken(user: JwtPayload): Promise<Tokens> {
    try {
      const tokens = await this.getTokens(user.sub, user.username)

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
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
        expiresIn: '3d',
      }),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }
}