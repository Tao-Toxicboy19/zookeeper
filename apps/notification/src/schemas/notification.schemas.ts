import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes, Types } from 'mongoose'

@Schema()
class NotificationItem {
    @Prop({
        type: SchemaTypes.ObjectId,
        required: true,
    })
    _id: Types.ObjectId

    @Prop({ type: String, required: true })
    msg: string

    @Prop({ type: Boolean, default: false })
    isReaded: boolean

    @Prop({ type: Date, default: () => new Date() })
    createdAt: Date

    @Prop({ type: Date, default: null })
    readedAt: Date | null

    @Prop({ type: Date, default: null })
    deletedAt: Date | null
}

const NotificationItemSchema = SchemaFactory.createForClass(NotificationItem)

@Schema({ versionKey: false })
export class Notification extends AbstractDocument {
    @Prop({
        type: SchemaTypes.ObjectId,
        required: true,
        default: new Types.ObjectId(),
    })
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId

    @Prop({ type: [NotificationItemSchema], default: [] })
    notifications: NotificationItem[]
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
