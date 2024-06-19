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
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ProducerService } from './producer/producer.service'
import * as bcrypt from 'bcrypt'
import { UsersService } from './users/users.service'
import { ObjectId } from 'mongodb';

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
    return {
      message: 'Unauthorized',
      statusCode: HttpStatus.UNAUTHORIZED
    }
  }

  async signin(dto: SigninDto): Promise<EmailResponse> {
    try {
      const user = await this.userService.validateUser(dto.username)
      await this.producerService.sendMail(JSON.stringify(user))
      return {
        email: user.email
      }
    } catch (error) {
      throw error
    }
  }

  async confrimOTP(dto: ConfirmOTPDto): Promise<TokenResponse> {
    try {
      const value = await this.redisService.getValue(dto.userId)
      const user = JSON.parse(value)
      if (!value) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `don't have otp`
        }
      }
      if (dto.otp !== user.otp) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'otp invalid'
        }
      }
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