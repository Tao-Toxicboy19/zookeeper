import { Inject, Injectable } from '@nestjs/common';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME, AuthServiceClient, MAIL_PACKAGE_NAME, MAIL_SERVICE_NAME, MailServiceClient, SigninDto, SignupDto, User, UserResponse, ValidateDto } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ConfrimOTPDto, EmailResponse } from '@app/common/types/auth';

@Injectable()
export class AuthClientService {
  private authServiceClient: AuthServiceClient

  constructor(
    @Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc,
  ) { }

  onModuleInit() {
    this.authServiceClient = this.client.getService<AuthClientService>(AUTH_SERVICE_NAME)
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

  confrimOtp(request: ConfrimOTPDto) {
    return this.authServiceClient.confrimOtp(request)
  }
}
