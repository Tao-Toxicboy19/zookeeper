import { SigninDto, Token } from '@app/common';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AuthService implements OnModuleInit {
  onModuleInit() { }

  signin(dto: SigninDto): Token | Promise<Token> {
    return {
      accessToken: '123',
      refreshToken: '1123'
    }
  }
}
