import {CoinSymbol} from "Core/Coins";
import {Wallet} from "@berrywallet/core";

interface ITransaction {
    txid: string;
    amount: number;
    time: number;
    status: string;
    confirmations: number;
}

interface ICoinWallet {
    coinKey: CoinSymbol;
    walletData?: Wallet.Entity.WalletData;
    loading: boolean;
    blockHeight?: number;
}

export {
    ITransaction,
    ICoinWallet
}