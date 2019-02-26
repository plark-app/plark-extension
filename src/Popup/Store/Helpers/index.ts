import { CoinSymbol, TickerData } from 'Core/Coins';
import proxyStore from '../Store';

export function extractTicker(coin: CoinSymbol): TickerData {
    return proxyStore.getState().Coin.tickers[coin] || {
        key: coin,
        priceBtc: 0,
        priceFiat: 0,
    } as TickerData;
}
