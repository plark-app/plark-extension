import { Dictionary, each } from 'lodash';
import { createSelector } from 'reselect';
import { Wallet } from '@plark/wallet-core';
import { IStore, IWalletStore, ICoinStore } from 'Core/Declarations/Store';
import { ICoinWallet } from 'Core/Declarations/Wallet';
import { findCoin, findFiat, TickerData, CoinSymbol } from 'Core/Coins';

export const coinStateSelector = (state: IStore) => state.Coin;
export const walletStateSelector = (state: IStore) => state.Wallet;
export const activeCoinsSelector = (state: IStore) => coinStateSelector(state).coins;


export const currentFiatSelector = createSelector(coinStateSelector, (coinStore: ICoinStore) => {
    const { currentFiatKey } = coinStore;

    return findFiat(currentFiatKey);
});


export const currentCoinSelector = createSelector(coinStateSelector, (coinStore: ICoinStore) => {
    const { currentCoinKey } = coinStore;

    return findCoin(currentCoinKey);
});


export const tickerSelector = createSelector(
    coinStateSelector,
    (coinStore: ICoinStore) => (coin: CoinSymbol) => {
        return coinStore.tickers[coin] || {
            key: coin,
            priceBtc: 0,
            priceUsd: 0,
            priceFiat: 0,
        } as TickerData;
    },
);


export const walletBalanceSelector = createSelector(
    walletStateSelector,
    activeCoinsSelector,
    (walletStore: IWalletStore, activeCoins: CoinSymbol[]) => {

        const balances: Dictionary<number> = {};

        each(walletStore, (wallet: ICoinWallet, coin: CoinSymbol): void => {
            if (!wallet || !wallet.walletData || activeCoins.indexOf(coin) == -1) {
                balances[coin] = 0;
                return;
            }

            const wdProvider = new Wallet.Provider.WDProvider(wallet.walletData);
            balances[coin] = Wallet.calculateBalance(wdProvider.balance);

            return;
        });

        return (coin: CoinSymbol): number => {
            return balances[coin] || 0;
        };
    },
);


export const walletProviderSelector = createSelector(
    walletStateSelector,
    activeCoinsSelector,
    (walletStore: IWalletStore, activeCoins: CoinSymbol[]) => {

        const wdProviders: Dictionary<Wallet.Provider.WDProvider> = {};

        each(walletStore, (wallet: ICoinWallet, coin: CoinSymbol): void => {
            if (!wallet || !wallet.walletData || activeCoins.indexOf(coin) == -1) {
                wdProviders[coin] = null;
                return;
            }

            wdProviders[coin] = new Wallet.Provider.WDProvider(wallet.walletData);

            return;
        });

        return (coin: CoinSymbol): Wallet.Provider.WDProvider | null => {
            return wdProviders[coin] || null;
        };
    },
);
