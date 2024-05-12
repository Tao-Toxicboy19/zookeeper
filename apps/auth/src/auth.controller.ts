import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  SigninDto,
  SignupDto,
  ValidateDto
} from '@app/common';
import { ConfirmOTPDto } from '@app/common/types/auth';

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

  confirmOtp(request: ConfirmOTPDto) {
    return this.authService.confrimOTP(request)
  }
}
