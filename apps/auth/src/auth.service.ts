import { JwtPayload, SigninDto, SignupDto, Token, ValidateDto } from '@app/common'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ProducerService } from './producer/producer.service'
import { randomUUID } from 'crypto'
import { TokenResponse, UserResponse } from '@app/common/types/auth'
import * as bcrypt from 'bcrypt'
import { Users } from './entities/user.entity'

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly producerService: ProducerService,
  ) { }

  onModuleInit() { }

  async validateUser(dto: ValidateDto): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { username: dto.username } })
    if (user && await bcrypt.compare(dto.password, user.password)) {
      return {
        user: {
          username: user.username,
          userId: user._id,
        }
      }
    }
    return {
      error: {
        message: 'Unauthorized',
        error: 'User not found',
        statusCode: 401
      }
    }
  }

  async signup(dto: SignupDto): Promise<TokenResponse> {
    try {
      const [existUser, existEmail] = await Promise.all([
        this.userRepository.findOne({ where: { username: dto.username } }),
        this.userRepository.findOne({ where: { email: dto.email } })
      ])

      if (existUser || existEmail) {
        return {
          error: {
            message: `${existUser ? 'Username' : 'Email'} already exists`,
            error: 'User existng.',
            statusCode: 409
          }
        }
      }

      const hash = await bcrypt.hash(dto.password, 12)

      const user = new Users()

      user._id = randomUUID()
      user.username = dto.username
      user.password = hash
      user.email = dto.email

      await this.producerService.sendMessage(JSON.stringify(user))

      const tokens = await this.getTokens(user._id, user.username)

      return {
        token: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      }
    } catch (error) {
      throw error
    }
  }

  async signin(dto: SigninDto): Promise<TokenResponse> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.update(Users, dto.userId, { login: true })

      const tokens = await this.getTokens(dto.userId, dto.username)

      await queryRunner.commitTransaction()

      return {
        token: {
          accessToken: 'tokens.accessToken',
          refreshToken: 'tokens.refreshToken'
        }
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    }
  }

  async getTokens(userId: string, username: string): Promise<Token> {
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
