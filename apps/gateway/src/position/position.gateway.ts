import {
  JwtPayload,
  SocketAuthMiddleware,
  WsJwtGuard
} from '@app/common'
import {
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
import { Logger, UseGuards } from '@nestjs/common'

@WebSocketGateway(8001, {
  cors: '*'
})
@UseGuards(WsJwtGuard)
export class PositionGateway {
  private readonly logger = new Logger(PositionGateway.name)

  constructor(
    private readonly positionService: PositionService,
  ) {
  }

  afterInit(clinet: Socket) {
    clinet.use(SocketAuthMiddleware() as any)
  }

  @WebSocketServer()
  server: Server

  @SubscribeMessage('position')
  handleMessage(
    @ConnectedSocket() client: Socket,
  ): void {
    const payload: JwtPayload = client['user']
    if (payload.sub) {

      client.join(payload.sub)

      setInterval(async () => {
        await this.positionService.sendUserId(payload.sub)
      }, 1000)

      this.server.to(payload.sub).emit('position')
    }
  }

  emitMessage(msg: string, userId: string): void {
    console.log(msg)
    this.server.to(userId).emit('position', msg)
  }
}