import { Dictionary, each, includes, filter, countBy } from 'lodash';
import { CoinInterface, FiatData, TickerData } from './Interfaces';
import { CoinSymbol, FiatSymbol } from './Symbols';
import { fiatList } from './FiatList';
import { coinList } from './CoinList';

export { CoinInterface, FiatData, TickerData, CoinSymbol, FiatSymbol, coinList, fiatList };

export enum TxDirection {
    Up = 'up',
    Down = 'down'
}

export const filterCoinList = (keys: (string | CoinSymbol)[]): Dictionary<CoinInterface> => {
    const filteredCoinList: Dictionary<CoinInterface> = {};

    each(coinList, (coin: CoinInterface) => {
        if (includes(keys, coin.getKey())) {
            filteredCoinList[coin.getKey()] = coin;
        }
    });

    return filteredCoinList;
};


export const findCoin = (coinSymbol: string | CoinSymbol): CoinInterface | null => {
    return coinList[coinSymbol];
};

export const findFiat = (fiatSymbol: string | FiatSymbol): FiatData | null => {
    return fiatList[fiatSymbol];
};

export const sat2dec = (amount: number, decimal: number = 8): number => {
    return Math.round(amount * (10 ** decimal));
};

export const dec2sat = (satoshi: number, decimal: number = 8): number => {
    return +((satoshi / (10 ** decimal)).toFixed(decimal));
};

export function getRealCoins(): CoinInterface[] {
    return filter(coinList, (cn: CoinInterface) => false === cn.isTest());
}

export type CoinsCount = Dictionary<number> & {
    test?: number;
    real?: number;
};

export function getCoinCounts(coinSymbols: CoinSymbol[]): CoinsCount {
    return countBy(coinSymbols, (cs: CoinSymbol) => {
        const currentCoin = findCoin(cs);

        return currentCoin.isTest() ? 'test' : 'real';
    });
}
