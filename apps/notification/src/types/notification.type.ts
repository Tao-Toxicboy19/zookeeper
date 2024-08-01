export type Nofitication = {
    _id: any
    msg: string
    isRead?: boolean
    readedAt?: Date | null
    createdAt: Date
    deletedAt?: Date | null
    user_id: string
}
