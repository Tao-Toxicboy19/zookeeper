import { Types } from 'mongoose'

export type Notifications = {
    _id: string | Types.ObjectId
    userId: string | Types.ObjectId
    notifications: Notification[]
}

export type Notification = {
    _id: string | Types.ObjectId
    msg: string
    isReaded: boolean
    createdAt: Date
    readedAt: null
    deletedAt: null
}
