import {
    Body,
    Controller,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express'
import { KeyService } from './key.service'
import { KeyDto } from './dto'
import { CookieAuthGuard, JwtAuthGuard, JwtPayload } from '@app/common'
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions'

@Controller('key')
export class KeyController {
    constructor(private readonly keyService: KeyService) {}

    @UseInterceptors(GrpcToHttpInterceptor)
    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(
        @Body() dto: KeyDto,
        @Req() req: { user: JwtPayload },
    ) {
        return this.keyService.create({
            ...dto,
            userId: req.user.sub,
        })
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    getKey(@Req() req: { user: JwtPayload }) {
        return this.keyService.getKey({ userId: req.user.sub })
    }
}
