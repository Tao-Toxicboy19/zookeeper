import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  ConfirmOTPDto,
  SigninDto,
  SignupDto,
  ValidateDto
} from '@app/common'
import { ClientGrpc } from '@nestjs/microservices'
import { EmailResponse, ProfileDto, ProfileResponse, TokenResponse, UserResponse } from '@app/common/types/auth'
import { JwtService } from '@nestjs/jwt'
import { GooglePayload } from '@app/common/types/auth/google-payload.type'

@Injectable()
export class AuthService implements OnModuleInit {
  private authServiceClient: AuthServiceClient

  constructor(
    private readonly jwtService: JwtService,
    @Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc,
  ) { }

  onModuleInit() {
    this.authServiceClient = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
  }

  async signup(request: SignupDto): Promise<EmailResponse> {
    return new Promise((resolve, reject) => {
      this.authServiceClient.signup(request).subscribe({
        next: (response) => {
          // Assuming response contains the necessary fields
          const emailResponse: EmailResponse = {
            email: response.email,
            statusCode: response.statusCode,
            message: response.message,
            userId: response.userId
          }
          resolve(emailResponse)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }


  async signin(request: SigninDto): Promise<EmailResponse> {
    return new Promise((resolve, reject) => {
      this.authServiceClient.signin(request).subscribe({
        next: (response) => {
          // Assuming response contains the necessary fields
          const emailResponse: EmailResponse = {
            email: response.email,
            statusCode: response.statusCode,
            message: response.message,
            userId: response.userId
          }
          resolve(emailResponse)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  async validate(request: ValidateDto): Promise<UserResponse> {
    return new Promise((resolve, reject) => {
      this.authServiceClient.validate(request).subscribe({
        next: (response) => {
          // Assuming response contains the necessary fields
          const userResponse: UserResponse = {
            statusCode: response.statusCode,
            message: response.message,
            username: response.username,
            sub: response.sub,
          }
          resolve(userResponse)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  async refreshToken(request: SigninDto): Promise<TokenResponse> {
    return new Promise((resolve, reject) => {
      this.authServiceClient.refreshToken(request).subscribe({
        next: (response) => {
          resolve({ accessToken: response.accessToken, refreshToken: response.refreshToken })
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  async confirmOtp(request: ConfirmOTPDto): Promise<TokenResponse> {
    return new Promise((resolve, reject) => {
      this.authServiceClient.confirmOtp(request).subscribe({
        next: (response) => {
          resolve({ accessToken: response.accessToken, refreshToken: response.refreshToken })
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  async profile(request: ProfileDto): Promise<ProfileResponse> {
    return new Promise((resolve, reject) => {
      this.authServiceClient.profile(request).subscribe({
        next: (response) => {
          resolve({ userId: response.userId, username: response.username, email: response.email })
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  async googleLogin(req: { user: GooglePayload }): Promise<TokenResponse> {
    return new Promise((resolve, reject) => {
      this.authServiceClient.googleLogin({
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture,
        googleId: req.user.googleId,
      }).subscribe({
        next: (response) => {
          resolve({ accessToken: response.accessToken, refreshToken: response.refreshToken })
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  // async googleLogin(req: { user: GooglePayload }): Promise<any> {
  //   if (!req.user) {
  //     throw new Error('Google login failed: No user information received.')
  //   }
  //   // return new Promise((resolve, reject) => {
  //   //   this.authServiceClient.profile(req).subscribe({
  //   //     next: (response) => {
  //   //       resolve({ userId: response.userId, username: response.username, email: response.email })
  //   //     },
  //   //     error: (error) => {
  //   //       reject(error)
  //   //     }
  //   //   })
  //   // })

  //   const { email, name, picture, googleId } = req.user
  //   console.log(req.user)
  //   // let user = await this.userModel.findOne({ email })

  //   // if (!user) {
  //   //   user = new this.userModel({
  //   //     email,
  //   //     name,
  //   //     picture,
  //   //     googleId,
  //   //   })
  //   //   await user.save()
  //   // }

  //   const payload = { email: 'test@gmail.com' }

  //   return {
  //     accessToken: this.jwtService.sign(payload),
  //   }
  // }
}
