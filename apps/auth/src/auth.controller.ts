import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
    AuthServiceController,
    AuthServiceControllerMethods,
    ConfirmOTPDto,
    EmailResponse,
    ForgotPasswordDto,
    GetEmailDto,
    GoogleLoginDto,
    MailResponse,
    ProfileDto,
    ProfileResponse,
    ResetPasswordDto,
    SigninDto,
    SignupDto,
    TokenResponse,
    UserResponse,
    ValidateDto,
} from '@app/common'
import { UsersService } from './users/users.service'
import { ObjectId } from 'mongodb'

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {}

    signup(request: SignupDto): Promise<EmailResponse> {
        return this.authService.signup(request)
    }

    signin(request: SigninDto): Promise<EmailResponse> {
        return this.authService.signin(request)
    }

    validate(request: ValidateDto): Promise<UserResponse> {
        return this.authService.validateUser(request)
    }

    refreshToken(request: SigninDto): Promise<TokenResponse> {
        return this.authService.refreshToken({
            username: request.username,
            sub: request.userId,
        })
    }

    confirmOtp(request: ConfirmOTPDto): Promise<TokenResponse> {
        return this.authService.confrimOTP(request)
    }

    async profile(request: ProfileDto): Promise<ProfileResponse> {
        const user = await this.userService.findOneByUsername(request.username)
        console.log(user)
        return {
            userId: new ObjectId(user._id).toHexString(),
            username: user.username,
            email: user.email,
            picture: user.picture,
            name: user.name,
        }
    }

    async getEmail(request: GetEmailDto): Promise<MailResponse> {
        return this.userService.getEmail(request.userId)
    }

    googleLogin(request: GoogleLoginDto): Promise<TokenResponse> {
        return this.authService.googleLogin(request)
    }

    forgotPassword(request: ForgotPasswordDto): Promise<void> {
        return this.authService.forgotPassword(request.email)
    }

    resetPassword(request: ResetPasswordDto): Promise<void> {
        return this.authService.resetPassword(request.token, request.password)
    }
}
