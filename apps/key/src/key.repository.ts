import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Model, Connection } from 'mongoose'
import { AbstractRepository } from '@app/common'
import { Keys } from './schemas/key.schema'

@Injectable()
export class KeysRepository extends AbstractRepository<Keys> {
  protected readonly logger = new Logger(KeysRepository.name)

  constructor(
    @InjectModel(Keys.name) keyModel: Model<Keys>,
    @InjectConnection() connection: Connection,
  ) {
    super(keyModel, connection)
  }
}