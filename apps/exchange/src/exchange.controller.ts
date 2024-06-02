import { Controller } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import {
  ExchangeServiceController,
  ExchangeServiceControllerMethods,
  ValidateKeyDto
} from '@app/common';

@Controller()
@ExchangeServiceControllerMethods()
export class ExchangeController implements ExchangeServiceController {
  constructor(private readonly exchangeService: ExchangeService) { }

  validateKey(request: ValidateKeyDto) {
    return this.exchangeService.validateKey(request)
  }

  balance(request: ValidateKeyDto) {
    return this.exchangeService.balance(request)
  }
}

