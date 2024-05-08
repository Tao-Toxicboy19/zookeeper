import { Inject, Injectable } from '@nestjs/common';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME, AuthServiceClient, SigninDto, SignupDto, User, ValidateDto } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AuthClientService {
  private authServiceClient: AuthServiceClient

  constructor(
    @Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc
  ) { }

  onModuleInit() {
    this.authServiceClient = this.client.getService<AuthClientService>(AUTH_SERVICE_NAME)
  }

  signup(dto: SignupDto) {
    return this.authServiceClient.signup(dto)
  }

  signin(dto: SigninDto) {
    return this.authServiceClient.signin(dto)
  }

  validate(dto: ValidateDto): Observable<User> {
    return this.authServiceClient.validate(dto)
  }
}
