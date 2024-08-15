import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes, Types } from 'mongoose'

@Schema({ versionKey: false })
export class Keys extends AbstractDocument {
    @Prop()
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId

    @Prop({ required: true })
    apiKey: string

    @Prop({ required: true })
    secretKey: string

    @Prop({ default: Date.now, required: false })
    createdAt?: Date

    @Prop({ required: false })
    updatedAt?: Date

    @Prop({ required: false })
    daletedAt?: Date
}

export const KeySchema = SchemaFactory.createForClass(Keys)
