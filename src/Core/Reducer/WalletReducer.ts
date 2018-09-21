import { CoinSymbol } from "Core/Coins";
import { WalletAction } from "Core/Actions/Reducer";
import { IWalletStore } from "Core/Declarations/Store";
import { ICoinWallet } from "Core/Declarations/Wallet";
import { GlobalAction } from "../Actions/Reducer";

export const initialWalletState: IWalletStore = {};

function extractWallet(store: IWalletStore, coinKey: CoinSymbol): ICoinWallet {
    const wallet = store[coinKey];

    if (!wallet) {
        throw Error(`Not initialized wallet by key '${coinKey}'`);
    }

    return wallet;
}

export default function walletState(state: IWalletStore = initialWalletState, action) {

    switch (action.type) {
        case GlobalAction.ClearAllData:
            return initialWalletState;

        case WalletAction.InitWallet: {
            return {
                ...state,
                [action.coinKey]: {
                    coinKey: action.coinKey,
                    loading: true,
                    walletData: null,
                },
            };
        }

        case WalletAction.StartLoading:
        case WalletAction.StopLoading: {
            const coinKey: CoinSymbol = action.walletCoinKey;
            const wallet: ICoinWallet = extractWallet(state, coinKey);

            return Object.assign({}, state, {
                [coinKey]: {
                    ...wallet,
                    loading: action.type == WalletAction.StartLoading,
                },
            });
        }

        case WalletAction.SetWalletData:
        case WalletAction.Activate: {
            const wallet: ICoinWallet = extractWallet(state, action.walletCoinKey);

            return Object.assign({}, state, {
                [action.walletCoinKey]: {
                    ...wallet,
                    walletData: action.walletData,
                },
            });
        }
    }

    return state;
}
