import { ConfrimOTPDto, EmailResponse, JwtPayload, SigninDto, SignupDto, TokenResponse, Tokens, UserResponse, ValidateDto } from '@app/common'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ProducerService } from './producer/producer.service'
import { randomUUID } from 'crypto'
import * as bcrypt from 'bcrypt'
import { RedisService } from 'apps/amqp/src/redis/redis.service'
import { PrismaService } from './prisma/prisma.service'

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly producerService: ProducerService,
    private readonly redisService: RedisService,
  ) { }

  onModuleInit() { }

  async validateUser(dto: ValidateDto): Promise<UserResponse> {
    const user = await this.prisma.users.findUnique({ where: { username: dto.username } })
    if (user && await bcrypt.compare(dto.password, user.password)) {
      return {
        username: user.username,
        userId: user.id,
      }
    }
    return {
      message: 'Unauthorized',
      statusCode: 401
    }
  }

  async signup(dto: SignupDto): Promise<EmailResponse> {
    try {
      const [existUser, existEmail] = await Promise.all([
        this.prisma.users.findUnique({ where: { username: dto.username } }),
        this.prisma.users.findUnique({ where: { email: dto.email } })
      ])

      if (existUser || existEmail) {
        if (existEmail && existUser) {
          return {
            statusCode: 409,
            message: `User and email already exists`
          }
        }
        return {
          statusCode: 409,
          message: `${existEmail ? 'Email' + existEmail.email : 'User' + existUser.username} already exists`
        }
      }

      const hash = await bcrypt.hash(dto.password, 12)

      const user = {
        ...dto,
        id: dto.uuid,
        password: hash
      }

      await this.producerService.sendMessage(JSON.stringify(user))

      return {
        email: dto.email
      }
    } catch (error) {
      throw error
    }
  }

  async signin(dto: SigninDto): Promise<EmailResponse> {
    try {
      const user = await this.prisma.users.update({ where: { id: dto.userId }, data: { login: true } })

      return {
        email: user.email
      }
    } catch (error) {
      throw error
    }
  }

  async confrimOTP(dto: ConfrimOTPDto): Promise<TokenResponse> {
    try {
      const value = await this.redisService.getValue(dto.userId)
      const user = JSON.parse(value)
      if (!value) {
        return {
          statusCode: 400,
          message: `don't have otp`
        }
      }
      if (dto.otp !== user.otp) {
        return {
          statusCode: 400,
          message: 'otp invalid'
        }
      }
      const tokens = await this.getTokens(dto.userId, user.user.username)
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    } catch (error) {

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
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: '1d',
      }),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }
}
