import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { SignupDto, UserType, SigninDto } from '@app/common';
import { LocalAuthGuard } from './local-auto.guard';

@Controller('auth-client')
export class AuthClientController {
  private readonly logger = new Logger(AuthClientController.name)

  constructor(private readonly authClientService: AuthClientService) { }

  @Post('signup/local')
  signupLocal(
    @Body() dto: SignupDto
  ) {
    return this.authClientService.signup(dto)
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin/local')
  signinLocal(
    @Req() req: { user: UserType },
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SigninDto
  ) {
    // this.logger.debug(req.user.username)
    // console.log(req.user)
    return this.authClientService.signin(dto)
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
