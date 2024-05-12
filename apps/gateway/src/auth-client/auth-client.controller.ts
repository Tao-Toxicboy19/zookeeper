import { Controller, Post, Body, HttpCode, HttpStatus, Logger, UseGuards, Req, Res } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { Request, Response } from 'express';
import { SignupDto } from './dto';
import { JwtPayload, LocalAuthGuard, RefreshJwtAuthGuard } from '@app/common';
import { OtpDto } from './dto/otp.dto';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthClientController {
  private readonly logger = new Logger(AuthClientController.name)

  constructor(private readonly authClientService: AuthClientService) { }

  @Post('signup/local')
  signupLocal(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const id = randomUUID()
    res.cookie('user_id', id, {
      httpOnly: true,
    })
    return this.authClientService.signup({ ...dto, uuid: id })
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin/local')
  async signinLocal(
    @Req() req: { user: JwtPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('user_id', req.user.sub, {
      httpOnly: true,
    })
    return this.authClientService.signin({ username: req.user.username, userId: req.user.sub })
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh/local')
  async refreshToken(
    @Req() req: { user: JwtPayload },
    @Res({ passthrough: true }) res: Response
  ) {
    const {
      accessToken,
      refreshToken
    } = await firstValueFrom(this.authClientService.refreshToken({
      userId: req.user.sub,
      username: req.user.username
    }))
    
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000 // 15m
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1d
    })

    return {
      message: 'OK',
      statusCode: 200
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirm/otp')
  async confirmOtp(
    @Body() dto: OtpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken, statusCode, message } = await firstValueFrom(this.authClientService.confirmOtp({ otp: dto.otp, userId: req.cookies.user_id }))
    if (statusCode) {
      return {
        statusCode,
        message
      }
    }
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
