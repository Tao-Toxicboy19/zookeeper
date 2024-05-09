import { Controller, Post, Body, HttpCode, HttpStatus, Logger, UseGuards, Req, Res } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { User } from '@app/common';
import { LocalAuthGuard } from './local-auto.guard';
import { Request, Response } from 'express';
import { SignupDto } from './dto';

@Controller('auth-client')
export class AuthClientController {
  private readonly logger = new Logger(AuthClientController.name)

  constructor(private readonly authClientService: AuthClientService) { }

  @Post('signup/local')
  signupLocal(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authClientService.signup(dto)
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin/local')
  async signinLocal(
    @Req() req: { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('user_id', req.user.userId, {
      httpOnly: true,
    })
    this.authClientService.signin({ username: req.user.username, userId: req.user.userId })
    return { message: 'ok' }
  }


  @Post('validate')
  validate() {
    const dto = {
      username: 'test',
      password: 'test'
    }
    return this.authClientService.validate(dto)
  }
}
