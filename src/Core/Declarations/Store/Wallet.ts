import {ICoinWallet} from 'Core/Declarations/Wallet';

export interface IWalletStore {
    [coinKey: string]: ICoinWallet;
}