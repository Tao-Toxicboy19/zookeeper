import * as ccxt from 'ccxt'

export type State =
    | {
          status: 'success'
          message: ccxt.Position[] | string
      }
    | {
          status: 'error'
          message: string
      }
