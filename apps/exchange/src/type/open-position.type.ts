export type OpenPosition = {
    symbol: string
    leverage: number
    quantity: number
    userId:string
    status: 'Long' | 'Short'
}
