import { Controller, Get } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import {
  CalulateEMADto,
  FetchPriceDto,
  IndicatorServiceController,
  IndicatorServiceControllerMethods,
} from '@app/common';

@Controller()
@IndicatorServiceControllerMethods()
export class IndicatorsController implements IndicatorServiceController {
  constructor(private readonly indicatorsService: IndicatorsService) { }

  fetchPrice(request: FetchPriceDto) {
    return this.indicatorsService.fetchPrice(request)
  }

  calulateEma(request: CalulateEMADto) {
    return this.indicatorsService.calculateEMA(request)
  }
}
