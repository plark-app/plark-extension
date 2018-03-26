import {IStore} from "Core/Declarations/Store";
import {CoinSymbol, TickerInterface} from "Core/Coins";

import proxyStore from '../';

function getState(): IStore {
    return proxyStore.getState();
}

export function extractTicker(coin: CoinSymbol): TickerInterface {
    return getState().Coin.tickers[coin] || {
        key: coin,
        priceBtc: 0,
        priceFiat: 0
    } as TickerInterface;
}