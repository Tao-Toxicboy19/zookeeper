import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  SigninDto,
  SignupDto,
  ValidateDto
} from '@app/common';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) { }

  signup(dto: SignupDto) {
    return this.authService.signup(dto)
  }

  signin(dto: SigninDto) {
    return this.authService.signin(dto)
  }

  validate(dto: ValidateDto) {
    return this.authService.validateUser(dto)
  }
}
