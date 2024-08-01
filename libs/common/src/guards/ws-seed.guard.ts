import {
    CanActivate,
    ExecutionContext
} from "@nestjs/common"
import { Observable } from "rxjs"
import { Socket } from 'socket.io'

export class WsSeedGuard implements CanActivate {

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        if (context.getType() != 'ws') {
            return true
        }

        const client: Socket = context.switchToWs().getClient()
        WsSeedGuard.validateToken(client)
        return true
    }

    static validateToken(client: Socket) {
        // ส่ง seed มาจาก client
    }
}