import { Controller } from '@nestjs/common';
import { SignalService } from './signal.service';
import {
  SignalDto,
  SignalServiceController,
  SignalServiceControllerMethods
} from '@app/common';

@Controller()
@SignalServiceControllerMethods()
export class SignalController implements SignalServiceController {
  constructor(private readonly signalService: SignalService) { }

  ema(request: SignalDto) {
    return this.signalService.ema(request)
  }

  cdcActionZone(request: SignalDto) {
    return this.signalService.cdcActionZone(request)
  }
}
