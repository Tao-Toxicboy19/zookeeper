import * as ccxt from 'ccxt'

export type State =
    | {
          status: 'success'
          message: Position[] | string
      }
    | {
          status: 'error'
          message: string
      }
type Position = ccxt.Position & {
    orderId:string
    type: string
    timeframe: string | null
    ema: number | null
}
