import { Controller, Post, Body, HttpCode, HttpStatus, Logger, UseGuards, Req, Res, UseInterceptors } from '@nestjs/common'
import { Request, Response } from 'express'
import { SignupDto } from './dto'
import { JwtPayload, LocalAuthGuard, RefreshJwtAuthGuard } from '@app/common'
import { OtpDto } from './dto/otp.dto'
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) { }

  @UseInterceptors(GrpcToHttpInterceptor)
  @Post('signup/local')
  async signupLocal(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { email, userId } = await this.authService.signup(dto)
    res.cookie('user_id', userId, {
      httpOnly: true,
    })
    return {
      email
    }
  }

  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin/local')
  async signinLocal(
    @Req() req: { user: JwtPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('user_id', req.user.sub, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1d
    })
    return this.authService.signin({ username: req.user.username, userId: req.user.sub })
  }

  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh/local')
  async refreshToken(
    @Req() req: { user: JwtPayload },
    @Res({ passthrough: true }) res: Response
  ) {
    const {
      accessToken,
      refreshToken
    } = await this.authService.refreshToken({
      userId: req.user.sub,
      username: req.user.username
    })

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1d
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
    })

    return {
      message: 'OK',
      statusCode: 200
    }
  }

  @UseInterceptors(GrpcToHttpInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('confirm/otp')
  async confirmOtp(
    @Body() dto: OtpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const {
      accessToken,
      refreshToken
    } = await this.authService.confirmOtp({ otp: dto.otp, userId: req.cookies.user_id })

    res.cookie('user_id', req.cookies.user_id, {
      httpOnly: true,
    })

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      // maxAge: 15 * 60 * 1000 // 15m
      maxAge: 3 * 24 * 60 * 60 * 1000 // 3d
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000 // 3d
    })
    return {
      message: 'OK',
      statusCode: 200
    }
  }
}
