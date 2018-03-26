import {Wallet} from '@berrywallet/core';
import {IStore} from 'Core/Declarations/Store';
import {findCoin, findFiat} from 'Core/Coins'
import {ICoinWallet} from "Core/Declarations/Wallet";
import {extractTicker} from "./Helpers";

export const mapWalletCoinToProps = (store: IStore) => {
    const {currentCoinKey, currentFiatKey} = store.Coin;

    const currentCoin = findCoin(currentCoinKey);
    const currentFiat = findFiat(currentFiatKey);

    const wallet: ICoinWallet = store.Wallet[currentCoinKey];

    const connectedProps = {
        coin: currentCoin,
        fiat: currentFiat,
        ticker: extractTicker(currentCoin.getKey()),
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
