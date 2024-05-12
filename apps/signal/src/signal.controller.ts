import { Controller, Get } from '@nestjs/common';
import { SignalService } from './signal.service';

@Controller()
export class SignalController {
  constructor(private readonly signalService: SignalService) {}

  @Get()
  getHello(): string {
    return this.signalService.getHello();
  }
}
