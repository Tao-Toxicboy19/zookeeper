import { Controller, Get } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeServiceController, ExchangeServiceControllerMethods, createExchangeDto } from '@app/common';

@Controller()
@ExchangeServiceControllerMethods()
export class ExchangeController implements ExchangeServiceController {
  constructor(private readonly exchangeService: ExchangeService) { }

  createExchange(request: createExchangeDto): void {
    
  }

}
