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
import { CreateLimit, SendUserIdDto } from '@app/common/types/exchange';

@Controller()
@ExchangeServiceControllerMethods()
export class ExchangeController implements ExchangeServiceController {
  constructor(private readonly exchangeService: ExchangeService) { }

  sendUserId(request: SendUserIdDto): void {
    this.exchangeService.position(request.userId)
  }

  validateKey(request: ValidateKeyDto) {
    return this.exchangeService.validateKey(request)
  }

  balance(request: BalanceDto): BalanceResponse | Promise<BalanceResponse> | Observable<BalanceResponse> {
    return this.exchangeService.balance(request)
  }

  createLimitBuy(request: CreateLimit): Promise<void> {
    return this.exchangeService.createLimitBuyOrder({
      id: request.id,
      symbol: request.symbol,
      leverage: request.leverage,
      quantity: request.quantity,
      userId: request.userId,
      position: request.position
    })
  }

  createLimitSell(request: CreateLimit): Promise<void> {
    return this.exchangeService.createLimitBuyOrder({
      id: request.id,
      symbol: request.symbol,
      leverage: request.leverage,
      quantity: request.quantity,
      userId: request.userId,
      position: request.position
    })
  }

  closePosition(request: CreateLimit): Promise<void> {
    return this.exchangeService.closePosition({
      id: request.id,
      symbol: request.symbol,
      leverage: request.leverage,
      quantity: request.quantity,
      userId: request.userId,
      position: request.position
    })
  }
}

