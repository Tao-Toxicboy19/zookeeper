import { JwtAuthGuard, JwtPayload } from '@app/common'
import {
  Injectable,
  Logger,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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

import * as jwt from 'jsonwebtoken'
import { PositionService } from './position.service'

@WebSocketGateway(+process.env.WEB_SOCKET || 8001, {
  cors: '*'
})
export class PositionGateway {

  constructor(
    private readonly configService: ConfigService,
    private readonly positionService: PositionService,
  ) { }

  @WebSocketServer()
  server: Server

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const bearerToken = client.handshake.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(bearerToken, this.configService.get<string>('AT_SECRET')) as JwtPayload
    if (decoded.sub) {
      console.log(decoded.sub)
      setInterval(async () => {
        await this.positionService.sendUserId(decoded.sub)
      }, 1000)
    }
    this.server.emit('message', message)
  }

  emitMessage(message: string): void {
    console.log('Forwarding message to WebSocket:', message)
    this.server.emit('message', message)
  }
}