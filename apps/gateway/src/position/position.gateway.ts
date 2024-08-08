import {
    CookieAuthGuard,
    JwtPayload,
    SocketAuthMiddleware,
    WsJwtGuard,
} from '@app/common'
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { PositionService } from './position.service'
import { Logger, UseGuards } from '@nestjs/common'
import { SecretGuard } from '../key/secret.guard'

@WebSocketGateway({
    cors: '*',
})
export class PositionGateway {
    private readonly logger = new Logger(PositionGateway.name)

    constructor(private readonly positionService: PositionService) {}

    afterInit(clinet: Socket) {
        clinet.use(SocketAuthMiddleware() as any)
    }

    @WebSocketServer()
    server: Server

    @UseGuards(SecretGuard)
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('position')
    handleMessage(@ConnectedSocket() client: Socket): void {
        const payload: JwtPayload = client['user']
        const seed: string = client['seed']
        if (payload.sub) {
            client.join(payload.sub)

            setInterval(async () => {
                await this.positionService.sendUserId(payload.sub, seed)
            }, 1000)

            this.server.to(payload.sub).emit('position')
        }
    }

    emitMessage(msg: string, userId: string): void {
        console.log(msg)
        this.server.to(userId).emit('position', msg)
    }
}
