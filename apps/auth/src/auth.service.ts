import { JwtPayload, SigninDto, SignupDto, Token, User, ValidateDto } from '@app/common';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from './entities/user. entity';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  onModuleInit() { }

  async validateUser(dto: ValidateDto): Promise<User> {
    this.logger.debug(dto)
    const user = await this.userRepository.findOne({ where: { username: dto.username } })
    if (user) {
      return {
        username: user.username,
        userId: user.password,
      }
    }
    return {}
  }

  async signup(dto: SignupDto): Promise<Token> {
    try {
      const existng = await this.userRepository.findOne({ where: { username: dto.username } })
      if (existng) {
        this.logger.debug(existng)
        console.log(existng)
        return {
          accessToken: `${existng.created_at}`,
          refreshToken: `${existng.updated_at}`
        }
      }

      await this.userRepository.save(dto)

      return {
        accessToken: '123',
        refreshToken: '1123'
      }
    } catch (error) {
      throw error
    }
  }

  async signin(dto: SigninDto): Promise<Token> {
    const tokens = await this.getTokens('123', dto.username)

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  }

  async getTokens(userId: string, username: string): Promise<Token> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      username: username,
    }

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT_SECRET,
        expiresIn: '1d',
      }),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }
}
