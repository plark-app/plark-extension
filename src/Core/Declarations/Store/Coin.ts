import {Dictionary} from "lodash";
import {CoinSymbol, FiatSymbol, TickerInterface} from 'Core/Coins';

export interface ICoinStore {
    coins: CoinSymbol[];
    tickers: Dictionary<TickerInterface>;
    blockHeights: Dictionary<number>;
    currentFiatKey: FiatSymbol & string;
    currentCoinKey: CoinSymbol & string;
}