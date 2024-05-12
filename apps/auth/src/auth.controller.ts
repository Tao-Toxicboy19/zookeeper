import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  SigninDto,
  SignupDto,
  ValidateDto
} from '@app/common';
import { ConfirmOTPDto, TokenResponse } from '@app/common/types/auth';
import { Observable } from 'rxjs';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) { }

  signup(request: SignupDto) {
    return this.authService.signup(request)
  }

  signin(request: SigninDto) {
    return this.authService.signin(request)
  }

  validate(request: ValidateDto) {
    return this.authService.validateUser(request)
  }

  refreshToken(request: SigninDto) {
    return this.authService.refreshToken({ username: request.username, sub: request.userId })
  }

  confirmOtp(request: ConfirmOTPDto) {
    return this.authService.confrimOTP(request)
  }

}
