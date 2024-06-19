import { Controller, Get, Logger } from '@nestjs/common';
import { KeyService } from './key.service';
import { CreateKeyDto, KeyResponse, KeyServiceController, KeyServiceControllerMethods, KeyUserId } from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@KeyServiceControllerMethods()
export class KeyController implements KeyServiceController {
  private readonly logger = new Logger(KeyController.name)

  constructor(private readonly keyService: KeyService) { }

  createKey(request: CreateKeyDto) {
    return this.keyService.create(request)
  }

  getKey(request: KeyUserId): KeyResponse | Promise<KeyResponse> | Observable<KeyResponse> {
    return this.keyService.getKey(request.userId)
  }

}
