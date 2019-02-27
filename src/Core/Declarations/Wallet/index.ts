import {CoinSymbol} from 'Core/Coins';
import {Wallet} from '@plark/wallet-core';

export interface ITransaction {
    txid: string;
    amount: number;
    time: number;
    status: string;
    confirmations: number;
}

export interface ICoinWallet {
    coinKey: CoinSymbol;
    walletData?: Wallet.Entity.WalletData;
    loading: boolean;
    blockHeight?: number;
}
