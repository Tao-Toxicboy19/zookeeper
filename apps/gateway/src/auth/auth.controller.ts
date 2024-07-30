import { Controller, Post, Body, HttpCode, HttpStatus, Logger, UseGuards, Req, Res, UseInterceptors, Get } from '@nestjs/common'
import { Request, Response } from 'express'
import { SignupDto } from './dto'
import { GoogleAuthGuard, JwtAuthGuard, JwtPayload, LocalAuthGuard, RefreshJwtAuthGuard } from '@app/common'
import { OtpDto } from './dto/otp.dto'
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions'
import { AuthService } from './auth.service'
import { GooglePayload } from '@app/common/types/auth/google-payload.type'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @UseInterceptors(GrpcToHttpInterceptor)
  @Post('signup/local')
  async signupLocal(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { email, userId } = await this.authService.signup(dto)
    res.cookie('user_id', userId, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
      sameSite: 'strict',
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
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
      sameSite: 'strict'
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
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
      sameSite: 'strict',
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      sameSite: 'strict',
    })

    return {
      "message": "OK",
      "statusCode": 200
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

    res.clearCookie('user_id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ทำให้ cookie เป็น secure ใน production
      sameSite: 'strict', // ใช้ sameSite เพื่อป้องกัน CSRF
    })

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 3d
      sameSite: 'strict'
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 3d
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    return {
      message: 'OK',
      statusCode: 200
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    if (req.cookies.access_token || req.cookies.user_id) {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
    }
    return {
      message: 'OK',
      statusCode: 200
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(
    @Req() req: { user: JwtPayload }
  ) {
    return this.authService.profile({ username: req.user.username })
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(
    @Req() req: { user: GooglePayload },
    @Res() res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.googleLogin(req)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
      sameSite: 'strict',
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      sameSite: 'strict',
    })

    res.redirect(this.configService.get<string>('SOCIAL_REDIRECT'))
  }
}