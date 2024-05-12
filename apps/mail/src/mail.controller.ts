import { Controller, Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailServiceController, MailServiceControllerMethods, SendMailDto } from '@app/common';

@Controller()
@MailServiceControllerMethods()
export class MailController implements MailServiceController {
  private readonly logger = new Logger(MailController.name)

  constructor(private readonly mailService: MailService) { }

  sendMail(dto: SendMailDto): void {
    console.log('hello world')
    this.mailService.sendMail(dto)
  }
}
