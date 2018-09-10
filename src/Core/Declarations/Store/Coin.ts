import { Dictionary } from 'lodash';
import { CoinSymbol, FiatSymbol, TickerData } from 'Core/Coins';

export interface ICoinStore {
    coins: CoinSymbol[];
    tickers: Dictionary<TickerData>;
    blockHeights: Dictionary<number>;
    currentFiatKey: FiatSymbol & string;
    currentCoinKey: CoinSymbol & string;
}
