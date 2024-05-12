import { Injectable } from '@nestjs/common';

@Injectable()
export class SignalService {
  getHello(): string {
    return 'Hello World!';
  }
}
