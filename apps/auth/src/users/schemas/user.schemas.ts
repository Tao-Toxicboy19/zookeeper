import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
    @Prop({ required: true })
    username: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true })
    email: string

    @Prop({ default: Date.now, required: false })
    createdAt?: Date

    @Prop({ required: false })
    updatedAt?: Date

    @Prop({ required: false })
    daletedAt?: Date
}

export const UserSchema = SchemaFactory.createForClass(User);