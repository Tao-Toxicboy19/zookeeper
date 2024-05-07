import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthServiceController, AuthServiceControllerMethods, SigninDto } from '@app/common';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) { }

  signin(dto: SigninDto) {
    return this.authService.signin(dto)
  }
}
