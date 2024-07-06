import { Controller } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import {
  BalanceDto,
  BalanceResponse,
  ExchangeServiceController,
  ExchangeServiceControllerMethods,
  ValidateKeyDto
} from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@ExchangeServiceControllerMethods()
export class ExchangeController implements ExchangeServiceController {
  constructor(private readonly exchangeService: ExchangeService) { }

  validateKey(request: ValidateKeyDto) {
    return this.exchangeService.validateKey(request)
  }
  balance(request: BalanceDto): BalanceResponse | Promise<BalanceResponse> | Observable<BalanceResponse> {
    return this.exchangeService.balance(request)
  }
}

