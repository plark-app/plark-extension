import {combineReducers} from 'redux';

import {IStore} from 'Core/Declarations/Store';

import GlobalReducer from './GlobalReducer';
import TermsReducer from './TermsReducer';
import CoinReducer from './CoinReducer';
import WelcomeReducer from './WelcomeReducer';
import KeyringReducer from './KeyringReducer';
import WalletReducer from './WalletReducer';
import OptionReducer from './OptionReducer';

export default combineReducers<IStore>({
    Global: GlobalReducer,
    Welcome: WelcomeReducer,
    Terms: TermsReducer,
    Keyring: KeyringReducer,
    Coin: CoinReducer,
    Wallet: WalletReducer,
    Option: OptionReducer
});