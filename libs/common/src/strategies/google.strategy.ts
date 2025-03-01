import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Profile } from 'passport'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, emails, photos } = profile
        const { givenName, familyName } = profile.name || {} // Add a fallback to an empty object

        const payload = {
            googleId: id,
            email: emails[0].value,
            name: `${givenName} ${familyName}`,
            picture: photos[0].value,
            // picture: photos[photos.length - 1].value,
            accessToken,
        }
        done(null, payload)
    }
}
