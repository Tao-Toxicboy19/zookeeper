import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ versionKey: false })
export class Notification extends AbstractDocument {
    @Prop()
    _id: Types.ObjectId

    @Prop()
    msg: string

    @Prop({ default: false })
    isReaded?: boolean

    @Prop({ required: true })
    user_id: string

    @Prop({ default: Date.now, required: false })
    createdAt?: Date

    @Prop({ required: false })
    readedAt?: Date

    @Prop({ required: false })
    updatedAt?: Date

    @Prop({ required: false })
    daletedAt?: Date
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
