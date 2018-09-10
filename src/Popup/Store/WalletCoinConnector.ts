import { Wallet } from '@berrywallet/core';
import { Coins } from 'Core';
import { IStore } from 'Core/Declarations/Store';
import { ICoinWallet } from "Core/Declarations/Wallet";
import { currentCoinSelector, currentFiatSelector, tickerSelector } from './Selector';

export interface IConnectedWalletCoinProps {
    coin: Coins.CoinInterface;
    fiat: Coins.FiatData;
    ticker?: Coins.TickerData;
    walletData?: Wallet.Entity.WalletData;
    balance?: Wallet.Entity.Balance;
}

export const mapWalletCoinToProps = (store: IStore): IConnectedWalletCoinProps => {
    const currentCoin = currentCoinSelector(store);
    const currentFiat = currentFiatSelector(store);

    const wallet: ICoinWallet = store.Wallet[currentCoin.getKey()];

    const connectedProps = {
        coin: currentCoin,
        fiat: currentFiat,
        ticker: tickerSelector(store)(currentCoin.getKey()),
        walletData: null,
        balance: null,
    };

    if (wallet.walletData) {
        const wdProvider = new Wallet.Provider.WDProvider(wallet.walletData);
        connectedProps.walletData = wdProvider.getData();
        connectedProps.balance = wdProvider.balance;
    }

    return connectedProps;
};
