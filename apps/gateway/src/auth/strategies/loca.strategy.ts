import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { UserResponse } from '@app/common'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super()
    }

    async validate(username: string, password: string): Promise<UserResponse> {
        try {
            const user = await this.authService.validate({ username, password })
            if (!user.sub) throw new UnauthorizedException()
            return user
        } catch (error) {
            throw new UnauthorizedException()
        }
    }
}