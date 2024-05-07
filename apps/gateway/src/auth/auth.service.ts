import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME, AuthServiceClient, SigninDto } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient

  constructor(
    @Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc
  ) { }

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
  }

  signin(dto: SigninDto) {
    return this.authService.signin(dto)
  }
}
