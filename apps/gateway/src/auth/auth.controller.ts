import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Logger,
    UseGuards,
    Req,
    Res,
    UseInterceptors,
    Get,
    Param,
    Inject,
    LoggerService,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ForgotPasswordDto, OtpDto, ResetPasswordDto, SignupDto } from './dto'
import {
    EmailResponse,
    GoogleAuthGuard,
    JwtAuthGuard,
    JwtPayload,
    LocalAuthGuard,
    OK,
    ProfileResponse,
    RefreshJwtAuthGuard,
} from '@app/common'
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions'
import { AuthService } from './auth.service'
import { GooglePayload } from '@app/common/types/auth/google-payload.type'
import { ConfigService } from '@nestjs/config'
import { Throttle } from '@nestjs/throttler'

@Controller('auth')
@Throttle({ default: { limit: 10, ttl: 1000 } })
@UseInterceptors(GrpcToHttpInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {}

    private handleSuccess(message: string, req: Request, userId?: string) {
        this.logger.log(message, AuthController.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            user_id: userId,
        })
    }

    private handleError(
        message: string,
        error: any,
        req: Request,
        userId?: string,
    ) {
        this.logger.error(message, error.stack, AuthController.name, {
            ip: req.ip,
            httpMethod: req.method,
            url: req.url,
            statusCode: 500,
            user_id: userId,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
        })
    }

    @Post('signup/local')
    @HttpCode(HttpStatus.CREATED)
    async signupLocal(
        @Body() dto: SignupDto,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
    ): Promise<EmailResponse> {
        try {
            const { email, userId } = await this.authService.signup(dto)
            res.cookie('user_id', userId, {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
                sameSite: 'strict',
            })

            this.handleSuccess('Sign up successful', req, userId)

            return {
                email,
            }
        } catch (error) {
            this.handleError('Failed to create user', error, req)
            throw error
        }
    }

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('signin/local')
    async signinLocal(
        @Req() req: { user: JwtPayload },
        @Res({ passthrough: true }) res: Response,
        @Req() request: Request,
    ): Promise<EmailResponse> {
        try {
            res.cookie('user_id', req.user.sub, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
                sameSite: 'strict',
            })

            this.handleSuccess('Sign in successful', request, req.user.sub)

            return this.authService.signin({
                username: req.user.username,
                userId: req.user.sub,
            })
        } catch (error) {
            this.handleError('Failed to sign in', error, request, req.user.sub)
            throw error
        }
    }

    @UseGuards(RefreshJwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh/local')
    async refreshToken(
        @Req() req: { user: JwtPayload },
        @Res({ passthrough: true }) res: Response,
        @Req() request: Request,
    ): Promise<OK> {
        try {
            const { accessToken, refreshToken } =
                await this.authService.refreshToken({
                    userId: req.user.sub,
                    username: req.user.username,
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

            this.handleSuccess('Token refreshed', request, req.user.sub)

            return {
                message: 'OK',
                statusCode: 200,
            }
        } catch (error) {
            this.handleError(
                'Failed to refresh token',
                error,
                request,
                req.user.sub,
            )

            throw error
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('confirm/otp')
    async handleOtp(
        @Body() dto: OtpDto,
        @Req() request: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<OK> {
        try {
            const { accessToken, refreshToken } =
                await this.authService.confirmOtp({
                    otp: dto.otp,
                    userId: request.cookies.user_id,
                })

            res.clearCookie('user_id', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // ทำให้ cookie เป็น secure ใน production
                sameSite: 'strict', // ใช้ sameSite เพื่อป้องกัน CSRF
            })

            res.cookie('access_token', accessToken, {
                httpOnly: true,
                maxAge: 1 * 24 * 60 * 60 * 1000, // 3d
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 3d
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })

            this.handleSuccess(
                'OTP confirmed',
                request,
                request.cookies.user_id,
            )

            return {
                message: 'OK',
                statusCode: 200,
            }
        } catch (error) {
            this.handleError(
                'Failed to confirm OTP',
                error,
                request,
                request.cookies.user_id,
            )

            throw error
        }
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<OK> {
        try {
            if (request.cookies.access_token || request.cookies.user_id) {
                res.clearCookie('access_token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                })
                res.clearCookie('refresh_token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                })
            }
            this.handleSuccess('Logged out', request, request.cookies.user_id)

            return {
                message: 'OK',
                statusCode: 200,
            }
        } catch (error) {
            this.handleError(
                'Failed to logout',
                error,
                request,
                request.cookies.user_id,
            )

            throw error
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile(
        @Req() req: { user: JwtPayload },
        @Req() request: Request,
    ): Promise<ProfileResponse> {
        try {
            this.handleSuccess(
                'Profile retrieved',
                request,
                request.cookies.user_id,
            )

            return this.authService.profile({ username: req.user.username })
        } catch (error) {
            this.handleError(
                'Failed to retrieve profile',
                error,
                request,
                request.cookies.user_id,
            )

            throw error
        }
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req: Request) {
        // Initiates the Google OAuth process
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleAuthRedirect(
        @Req() req: { user: GooglePayload },
        @Res() res: Response,
        @Req() request: Request,
    ) {
        try {
            const { accessToken, refreshToken } =
                await this.authService.googleLogin(req)

            res.cookie('access_token', accessToken, {
                httpOnly: true,
                maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })

            this.handleSuccess(
                'Google login successful',
                request,
                request.cookies.user_id,
            )

            res.redirect(this.configService.get<string>('SOCIAL_REDIRECT'))
        } catch (error) {
            this.handleError(
                'Failed Google login',
                error,
                request,
                request.cookies.user_id,
            )

            throw error
        }
    }

    @Post('forgot-password')
    async forgotPassword(
        @Body() dto: ForgotPasswordDto,
        @Req() request: Request,
    ): Promise<void> {
        try {
            this.handleSuccess('Forgot password request processed', request)

            return this.authService.forgotPassword(dto.email)
        } catch (error) {
            this.handleError(
                'Failed to process forgot password',
                error,
                request,
            )

            throw error
        }
    }

    @Post('reset-password/:token')
    async resetPassword(
        @Param('token') token: string,
        @Body() dto: ResetPasswordDto,
        @Req() request: Request,
    ): Promise<void> {
        try {
            this.handleSuccess('Password reset successful', request)

            return this.authService.resetPassword(dto.password, token)
        } catch (error) {
            this.handleError('Failed to reset password', error, request)

            throw error
        }
    }
}
