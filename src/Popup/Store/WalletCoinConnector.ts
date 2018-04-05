import {Wallet} from '@berrywallet/core';
import {IStore} from 'Core/Declarations/Store';
import {ICoinWallet} from "Core/Declarations/Wallet";
import {currentCoinSelector, currentFiatSelector, tickerSelector} from './Selector';

export const mapWalletCoinToProps = (store: IStore) => {
    const currentCoin = currentCoinSelector(store);
    const currentFiat = currentFiatSelector(store);

    const wallet: ICoinWallet = store.Wallet[currentCoin.getKey()];

    const connectedProps = {
        coin: currentCoin,
        fiat: currentFiat,
        ticker: tickerSelector(store)(currentCoin.getKey()),
        walletData: null,
        balance: null
    };

    if (wallet.walletData) {
        const wdProvider = new Wallet.Provider.WDProvider(wallet.walletData);
        connectedProps.walletData = wdProvider.getData();
        connectedProps.balance = wdProvider.balance;
    }

    return connectedProps;
};
