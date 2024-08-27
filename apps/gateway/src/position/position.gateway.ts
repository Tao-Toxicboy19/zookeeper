import { JwtPayload, SocketAuthMiddleware, WsJwtGuard } from '@app/common'
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UseGuards } from '@nestjs/common'
import { RabbitmqProducerService } from './rabbitmq/rabbitmq-producer.service'
import { EmitEvent } from './types/emit-event.type'

@WebSocketGateway({
    cors: '*',
})
@UseGuards(WsJwtGuard)
export class PositionGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger = new Logger(PositionGateway.name)
    private positionIntervals = new Map<string, NodeJS.Timeout>()
    private usdtIntervals = new Map<string, NodeJS.Timeout>()

    @WebSocketServer()
    server: Server

    constructor(
        private readonly rabbitmqProducerService: RabbitmqProducerService,
    ) {}

    afterInit(clinet: Socket) {
        clinet.use(SocketAuthMiddleware() as any)
    }

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id)
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id)
        const payload: JwtPayload = client['user']

        if (payload) {
            if (this.positionIntervals.has(payload.sub)) {
                clearInterval(this.positionIntervals.get(payload.sub))
                this.positionIntervals.delete(payload.sub)
            }

            if (this.usdtIntervals.has(payload.sub)) {
                clearInterval(this.usdtIntervals.get(payload.sub))
                this.usdtIntervals.delete(payload.sub)
            }
        }
    }

    @SubscribeMessage('event-position')
    handleMessage(@ConnectedSocket() client: Socket): void {
        const payload: JwtPayload = client['user']
        if (payload.sub) {
            client.join(payload.sub)

            if (!this.positionIntervals.has(payload.sub)) {
                const interval = setInterval(async () => {
                    this.rabbitmqProducerService.publish(
                        'position-queue',
                        JSON.stringify({ userId: payload.sub }),
                    )
                }, 1000)

                this.positionIntervals.set(payload.sub, interval)
            }
        }
    }

    @SubscribeMessage('event-usdt')
    handleEvent(@ConnectedSocket() client: Socket): void {
        const payload: JwtPayload = client['user']
        if (payload) {
            client.join(payload.sub)

            if (!this.usdtIntervals.has(payload.sub)) {
                const interval = setInterval(async () => {
                    this.rabbitmqProducerService.publish(
                        'usdt-queue',
                        JSON.stringify({ userId: payload.sub }),
                    )
                }, 2000)

                this.usdtIntervals.set(payload.sub, interval)
            }
        } else {
            this.server
                .to(payload.sub)
                .emit('event-msg', { message: 'Not found user.' })
        }
    }

    handleEmitEvent({ userId, event, msg }: EmitEvent): void {
        this.server.to(userId).emit(event, msg)
    }
}
