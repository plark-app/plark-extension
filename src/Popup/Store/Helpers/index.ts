import { CoinSymbol, TickerInterface } from 'Core/Coins';
import proxyStore from '../Store';

export function extractTicker(coin: CoinSymbol): TickerInterface {
    return proxyStore.getState().Coin.tickers[coin] || {
        key: coin,
        priceBtc: 0,
        priceFiat: 0,
    } as TickerInterface;
}
