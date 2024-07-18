import {
  JwtPayload,
  WsJwtGuard
} from '@app/common'
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket
} from '@nestjs/websockets'
import {
  Server,
  Socket
} from 'socket.io'
import { PositionService } from './position.service'
import { UseGuards } from '@nestjs/common'
import { SocketAuthMiddleware } from '../auth/socket-io.middleware'

@WebSocketGateway(+process.env.WEB_SOCKET || 8001, {
  cors: '*'
})
@UseGuards(WsJwtGuard)
export class PositionGateway {

  constructor(
    private readonly positionService: PositionService,
  ) { }

  @WebSocketServer()
  server: Server


  afterInit(clinet: Socket) {
    clinet.use(SocketAuthMiddleware() as any)
  }


  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const payload: JwtPayload = client['user']
    if (payload.sub) {
      setInterval(async () => {
        await this.positionService.sendUserId(payload.sub)
      }, 1000)
    }
    this.server.emit('message', message)
  }

  emitMessage(message: string): void {
    this.server.emit('message', message)
  }
}