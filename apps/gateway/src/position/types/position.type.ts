import * as ccxt from 'ccxt'

export type Position = {
    status: 'success'
    message: ccxt.Position[]
    userId: string
}
