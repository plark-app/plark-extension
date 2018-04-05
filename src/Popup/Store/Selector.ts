import {createSelector} from 'reselect';
import {Wallet} from '@berrywallet/core';
import {IStore, IWalletStore, ICoinStore} from "Core/Declarations/Store";
import {findCoin, findFiat, TickerInterface, CoinSymbol} from 'Core/Coins';

export const coinStateSelector = (state: IStore) => state.Coin;
export const walletStateSelector = (state: IStore) => state.Wallet;
export const activeCoinsSelector = (state: IStore) => coinStateSelector(state).coins;

export const currentFiatSelector = createSelector(coinStateSelector, (coinStore: ICoinStore) => {
    const {currentFiatKey} = coinStore;

    return findFiat(currentFiatKey);
});


export const currentCoinSelector = createSelector(coinStateSelector, (coinStore: ICoinStore) => {
    const {currentCoinKey} = coinStore;

    return findCoin(currentCoinKey);
});


export const tickerSelector = createSelector(
    coinStateSelector,
    (coinStore: ICoinStore) => (coin: CoinSymbol) => {
        return coinStore.tickers[coin] || {
            key: coin,
            priceBtc: 0,
            priceFiat: 0
        } as TickerInterface;
    }
);


export const walletBalanceSelector = createSelector(
    walletStateSelector,
    activeCoinsSelector,
    (walletStore: IWalletStore, activeCoins: CoinSymbol[]) => (coin: CoinSymbol): number => {
        const wallet = walletStore[coin] || null;
        if (!wallet || activeCoins.indexOf(coin) == -1) {
            return 0;
        }

        const wdProvider = new Wallet.Provider.WDProvider(wallet.walletData);

        return Wallet.Helper.calculateBalance(wdProvider.balance);
    }
);