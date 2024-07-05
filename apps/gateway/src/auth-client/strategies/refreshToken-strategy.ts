import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { JwtPayload } from '@app/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.refresh_token
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: configService.get<string>('RT_SECRET'),
            ignoreExpiration: false,
        })
    }

    async validate(payload: JwtPayload) {
        // This payload will be the decrypted token payload you provided when signing the token
        return payload
    }
}