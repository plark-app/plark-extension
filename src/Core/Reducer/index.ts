import { combineReducers } from 'redux';

import { IStore } from 'Core/Declarations/Store';

import GlobalReducer, { initialGlobalState } from './GlobalReducer';
import TermsReducer, { initialTermsState } from './TermsReducer';
import CoinReducer, { initialCoinState } from './CoinReducer';
import WelcomeReducer, { initialWelcomeState } from './WelcomeReducer';
import KeyringReducer, { initialKeyringState } from './KeyringReducer';
import WalletReducer, { initialWalletState } from './WalletReducer';
import OptionReducer, { initialOptionState } from './OptionReducer';

export {
    initialGlobalState,
    initialTermsState,
    initialCoinState,
    initialWelcomeState,
    initialKeyringState,
    initialWalletState,
    initialOptionState,
};

export default combineReducers<IStore>({
    Global: GlobalReducer,
    Welcome: WelcomeReducer,
    Terms: TermsReducer,
    Keyring: KeyringReducer,
    Coin: CoinReducer,
    Wallet: WalletReducer,
    Option: OptionReducer,
});