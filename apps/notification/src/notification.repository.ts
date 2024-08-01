import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Model, Connection } from 'mongoose'
import { AbstractRepository } from '@app/common'
import { Notification } from './schemas/notification.schemas'

@Injectable()
export class NotificationRepository extends AbstractRepository<Notification> {
  protected readonly logger = new Logger(NotificationRepository.name)

  constructor(
    @InjectModel(Notification.name) notificationModel: Model<Notification>,
    @InjectConnection() connection: Connection,
  ) {
    super(notificationModel, connection)
  }
}