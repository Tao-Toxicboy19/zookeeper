import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { KeyClientService } from './key-client.service';
import { JwtAuthGuard } from '../../../../libs/common/src/guards/jwt-auth.guard';
import { KeyDto } from './dto';

@Controller('key')
export class KeyClientController {
  constructor(private readonly keyClientService: KeyClientService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @Body() dto: KeyDto,
    @Req() req: { user: { sub: string, username: string } }
  ) {
    return this.keyClientService.create({ ...dto, userId: req.user.sub })
  }
}
