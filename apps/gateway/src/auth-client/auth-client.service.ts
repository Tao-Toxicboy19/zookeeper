import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  ConfirmOTPDto,
  SigninDto,
  SignupDto,
  ValidateDto
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthClientService implements OnModuleInit {
  private authServiceClient: AuthServiceClient

  constructor(
    @Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc,
  ) { }

  onModuleInit() {
    this.authServiceClient = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
  }

  signup(request: SignupDto) {
    return this.authServiceClient.signup(request)
  }

  signin(request: SigninDto) {
    return this.authServiceClient.signin(request)
  }

  validate(request: ValidateDto) {
    return this.authServiceClient.validate(request)
  }

  confirmOtp(request: ConfirmOTPDto) {
    return this.authServiceClient.confirmOtp(request)
  }
}
