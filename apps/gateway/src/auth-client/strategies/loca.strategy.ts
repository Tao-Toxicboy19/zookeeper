import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { User } from '@app/common'
import { firstValueFrom } from 'rxjs'
import { AuthClientService } from 'apps/gateway/src/auth-client/auth-client.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authClientService: AuthClientService) {
        super()
    }

    async validate(username: string, password: string): Promise<User> {
        try {
            const user = await firstValueFrom(this.authClientService.validate({ username, password }))
            if (!user.userId) throw new UnauthorizedException()
            return user
        } catch (error) {
            throw new UnauthorizedException()
        }
    }
}