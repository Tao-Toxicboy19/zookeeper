import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class CookieAuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>()

        if (request.cookies?.seed_phrase) {
            request['seed_phrase'] = request.cookies?.seed_phrase
            return true
        } else {
            return false
        }
    }
}
