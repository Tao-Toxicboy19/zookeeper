import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ versionKey: false })
export class Keys extends AbstractDocument {
    @Prop()
    _id: Types.ObjectId

    @Prop({ required: true, unique: true })
    userId: string

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
