// cors.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
  ) { }
  use(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', this.configService.get<string>('CLIENT_URL'))
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    next()
  }
}