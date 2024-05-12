import { ConfirmOTPDto, EmailResponse, JwtPayload, PrismaService, RedisService, SigninDto, SignupDto, TokenResponse, Tokens, UserResponse, ValidateDto } from '@app/common'
import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ProducerService } from './producer/producer.service'
import * as bcrypt from 'bcrypt'

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
      statusCode: HttpStatus.UNAUTHORIZED
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
            statusCode: HttpStatus.CONFLICT,
            message: `User and email already exists`
          }
        }
        return {
          statusCode: HttpStatus.CONFLICT,
          message: `${existEmail ? 'Email' + existEmail.email : 'User' + existUser.username} already exists`
        }
      }

      const hash = await bcrypt.hash(dto.password, 12)

      const user = {
        ...dto,
        id: dto.uuid,
        password: hash
      }

      await this.producerService.sendSignup(JSON.stringify(user))

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
        expiresIn: '1d',
      }),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }
}


// generator client {
//   provider    = "prisma-client-js"
//   dotenv_path = "./apps/auth/.env"
// }

// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }

// model Users {
//   id         String   @id
//   username   String   @unique()
//   password   String
//   email      String   @unique()
//   login      Boolean  @default(false)
//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt
// }
