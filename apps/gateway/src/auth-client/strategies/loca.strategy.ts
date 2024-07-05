import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { UserResponse } from '@app/common'
import { AuthClientService } from 'apps/gateway/src/auth-client/auth-client.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authClientService: AuthClientService) {
        super()
    }

    async validate(username: string, password: string): Promise<UserResponse> {
        try {
            console.log(username)
            const user = await this.authClientService.validate({ username, password })
            if (!user.sub) throw new UnauthorizedException()
            return user
        } catch (error) {
            throw new UnauthorizedException()
        }
    }
}