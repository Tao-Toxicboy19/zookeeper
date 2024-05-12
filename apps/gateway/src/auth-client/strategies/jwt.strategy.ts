import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { JwtPayload } from '@app/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService
    ) {
        console.log(configService.get<string>('AT_SECRET'))
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.access_token
                },
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            secretOrKey: process.env.AT_SECRET,
            ignoreExpiration: false,
        })
    }

    async validate(payload: JwtPayload) {
        // This payload will be the decrypted token payload you provided when signing the token
        return { sub: payload.sub, username: payload.username }
    }
}