import { AbstractDocument } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false })
export class Orders extends AbstractDocument {
    @Prop({ required: true })
    userId: string

    @Prop()
    symbol: string

    @Prop()
    quantity: string

    @Prop()
    timeframe: string

    @Prop()
    type: string

    @Prop()
    ema: number

    @Prop()
    leverage: number

    @Prop({ default: Date.now, required: false })
    createdAt?: Date

    @Prop({ required: false })
    updatedAt?: Date

    @Prop({ required: false })
    daletedAt?: Date
}

export const OrderSchema = SchemaFactory.createForClass(Orders)