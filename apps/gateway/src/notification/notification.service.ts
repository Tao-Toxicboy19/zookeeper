import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(@Inject('NOTIFICATION_SERVICE') private client: ClientProxy) { }

  async hello(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.send<string>('hello', 'hello world').subscribe({
        next: (response) => {
          resolve(response)
        },
        error: (err) => {
          reject(err)
        },
      })
    })
  }
}
