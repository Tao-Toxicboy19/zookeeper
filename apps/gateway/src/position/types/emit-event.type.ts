import * as ccxt from 'ccxt'

export type EmitEvent = {
    userId: string
    event: string
    msg:
        | string
        | {
              message: string
              usdt: number
          }
        | {
              message: ccxt.Position[]
          }
}

export type Wallet = {
    userId: string
    statusCode?: number
    message?: string
    usdt?: string
}
