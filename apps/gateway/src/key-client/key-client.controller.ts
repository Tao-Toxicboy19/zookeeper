import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { KeyClientService } from './key-client.service'
import { KeyDto } from './dto'
import { JwtAuthGuard, JwtPayload } from '@app/common'
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions'

@Controller('key')
export class KeyClientController {
  constructor(private readonly keyClientService: KeyClientService) { }

  @UseInterceptors(GrpcToHttpInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @Body() dto: KeyDto,
    @Req() req: { user: JwtPayload }
  ) {
    return this.keyClientService.create({ ...dto, userId: req.user.sub })
  }

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // getKey(
  //   @Req() req: { user: JwtPayload }
  // ) {
  //   return this.keyClientService.getKey({ userId: req.user.sub })
  // }
}
