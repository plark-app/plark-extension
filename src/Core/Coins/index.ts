import {Dictionary, each, includes, filter} from "lodash";
import {CoinInterface, FiatInterface, TickerInterface} from './Interfaces';
import {CoinSymbol, FiatSymbol} from './Symbols';
import {fiatList} from './FiatList';
import {coinList} from './CoinList';

enum TxDirection {
    Up = 'up',
    Down = 'down'
}

const filterCoinList = (keys: (string | CoinSymbol)[]): Dictionary<CoinInterface> => {
    const filteredCoinList: Dictionary<CoinInterface> = {};

    each(coinList, (coin: CoinInterface) => {
        if (includes(keys, coin.getKey())) {
            filteredCoinList[coin.getKey()] = coin;
        }
    });

    return filteredCoinList;
};


const findCoin = (coinSymbol: string | CoinSymbol): CoinInterface | null => {
    return coinList[coinSymbol];
};

const findFiat = (fiatSymbol: string | FiatSymbol): FiatInterface | null => {
    return fiatList[fiatSymbol];
};

const sat2dec = (amount: number, decimal: number = 8): number => {
    return Math.round(amount * (10 ** decimal));
};

const dec2sat = (sathoshi: number, decimal: number = 8): number => {
    return +((sathoshi / (10 ** decimal)).toFixed(decimal));
};

function getRealCoins(): CoinInterface[] {
    return filter(coinList, (cn: CoinInterface) => {
        return false === cn.isTest();
    })
}

export {

    CoinInterface,
    FiatInterface,
    TickerInterface,

    // Coin Symbol list
    CoinSymbol,
    FiatSymbol,

    coinList,
    fiatList,

    getRealCoins,

    TxDirection,
    filterCoinList,

    findCoin,
    findFiat,

    sat2dec,
    dec2sat
}