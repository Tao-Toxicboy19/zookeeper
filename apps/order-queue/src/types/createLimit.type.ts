export type CreateLimit = {
    position: string
    order: Order
}

export type Order = {
    id: string
    symbol: string
    quantity: number
    timeframe: string
    type: string
    ema: number
    createdAt: Date
    updatedAt: Date
    deletedAt: null
    leverage: number
    user_id: string
    status: null
}