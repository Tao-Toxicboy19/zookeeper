import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { NotificationService } from './notification.service'
import {
  Server,
  Socket
} from 'socket.io'
import { JwtPayload, SocketAuthMiddleware, WsJwtGuard } from '@app/common'
import { UseGuards } from '@nestjs/common'

@WebSocketGateway(9090, {
  cors: '*'
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

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
  handleMessage(
    @ConnectedSocket() client: Socket,
  ): void {
    const payload: JwtPayload = client['user']
    // console.log(payload)
    if (payload.sub) {
      client.join(payload.sub)
    }
  }

  sendNotification(msg: string, userId: string) {
    console.log('send ok')
    console.log(msg)
    console.log(`user id: ${userId}`)
    this.server.to(userId).emit('notification', msg)
  }
}
