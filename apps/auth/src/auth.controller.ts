import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  ConfirmOTPDto,
  GetEmailDto,
  GoogleLoginDto,
  ProfileDto,
  SigninDto,
  SignupDto,
  ValidateDto
} from '@app/common'
import { UsersService } from './users/users.service'
import { ObjectId } from 'mongodb'

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) { }

  signup(request: SignupDto) {
    return this.userService.signup(request)
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

  async profile(request: ProfileDto) {
    const { username, email, _id } = await this.userService.validateUser(request.username)
    return {
      userId: new ObjectId(_id).toHexString(),
      username: username,
      email: email
    }
  }

  getEmail(request: GetEmailDto) {
    return {
      email: ''
    }
  }

  googleLogin(request: GoogleLoginDto) {
    return this.authService.googleLogin(request)
  }
}
