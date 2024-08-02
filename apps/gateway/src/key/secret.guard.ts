import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Socket } from 'socket.io'
import { verify } from 'jsonwebtoken'
import { KeyService } from "./key.service"
import { JwtPayload } from "@app/common"

@Injectable()
export class SecretGuard implements CanActivate {
    constructor(
        private readonly keyService: KeyService,
    ) { }

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient()
        const payload = SecretGuard.validateToken(client) as JwtPayload
        if (payload.sub) {
            // Ensure keyService is properly instantiated and injected
            const { statusCode } = await this.keyService.getKey({ userId: payload.sub })
            if (statusCode) {
                return false
            }
            return true
        }

        return false
    }

    static validateToken(client: Socket) {
        const { authorization } = client.handshake.headers
        const token: string = authorization.split(' ')[1]
        const payload = verify(token, 'VgmBOirkrV6x179MeyStIN8jr2xWQVWx' || process.env.AT_SECRET)
        client['user'] = payload
        return payload
    }
}
