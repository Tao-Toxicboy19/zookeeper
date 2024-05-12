export type Candle = [
    number,     // timestamp
    string,     // open
    string,     // high
    string,     // low
    string,     // close
    string,     // volume
    number,     // close timestamp
    string,     // quote asset volume
    number,     // number of trades
    string,     // Taker buy base asset volume
    string,     // Taker buy quote asset volume
    string      // ignore
]