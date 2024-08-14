import { JwtPayload, SocketAuthMiddleware, WsJwtGuard } from '@app/common'
import { UseGuards } from '@nestjs/common'
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway(8001, {
    cors: {
        origin: '*',
    },
})
export class NotificationGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server

    afterInit(clinet: Socket) {
        console.log('WebSocket server initialized')
        clinet.use(SocketAuthMiddleware() as any)
    }

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id)
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id)
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('notification')
    handleMessage(client: Socket, msg: string): void {
        console.log('Received message:', msg)
        const payload: JwtPayload = client['user']
        console.log(payload)
        if (payload.sub) {
            console.log(`join: ${payload.sub}`)
            client.join(payload.sub)
        }
    }

    sendNotification(msg: string, userId: string) {
        this.server.to(userId).emit('notification', msg)
    }
}
