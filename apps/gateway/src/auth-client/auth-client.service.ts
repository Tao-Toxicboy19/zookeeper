import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  ConfirmOTPDto,
  EmailResponse,
  SigninDto,
  SignupDto,
  ValidateDto
} from '@app/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AuthClientService implements OnModuleInit {
  private authServiceClient: AuthServiceClient

  constructor(
    @Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc,
  ) { }

  onModuleInit() {
    this.authServiceClient = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
  }

  async signup(request: SignupDto) {
    try {
      return await firstValueFrom(this.authServiceClient.signup(request))
    } catch (error) {
      throw error
    }
  }

  async signin(request: SigninDto) {
    try {
      return await firstValueFrom(this.authServiceClient.signin(request))
    } catch (error) {
      throw error
    }
  }

  async validate(request: ValidateDto) {
    try {
      return await firstValueFrom(this.authServiceClient.validate(request))
    } catch (error) {
      throw error
    }
  }

  async refreshToken(request: SigninDto) {
    try {
      return await firstValueFrom(this.authServiceClient.refreshToken(request))
    } catch (error) {
      throw error
    }
  }

  async confirmOtp(request: ConfirmOTPDto) {
    try {
      return await firstValueFrom(this.authServiceClient.confirmOtp(request))
    } catch (error) {
      throw error
    }
  }

  async getEmail() {
    return this.authServiceClient.getEmail({ userId: 'uset' })
  }
}
