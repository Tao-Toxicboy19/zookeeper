import * as ccxt from 'ccxt'

export type Position = {
    status: 'success'
    message: Positions[]
    userId: string
}

type Positions = ccxt.Position & {
    orderId:string
    type: string
    timeframe: string | null
    ema: number | null
}
