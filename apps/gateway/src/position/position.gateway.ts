
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import {
  Server
} from 'socket.io'

@WebSocketGateway(8002, {
  cors: '*'
})
export class PositionGateway {

  @WebSocketServer()
  server: Server

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log('Received message from client:', message)
    this.server.emit('message', message)
  }

  emitMessage(message: string): void {
    console.log('Forwarding message to WebSocket:', message)
    this.server.emit('message', message)
  }
}
