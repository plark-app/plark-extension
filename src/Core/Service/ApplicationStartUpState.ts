import {initialCoinState} from 'Core/Reducer/CoinReducer'
import {initialGlobalState} from 'Core/Reducer/GlobalReducer'
import {initialKeyringState} from 'Core/Reducer/KeyringReducer'
import {initialTermsState} from 'Core/Reducer/TermsReducer'
import {initialWelcomeState} from 'Core/Reducer/WelcomeReducer';
import {initialWalletState} from "Core/Reducer/WalletReducer";
import {initialOptionState} from "Core/Reducer/OptionReducer";

import {IStore} from 'Core/Declarations/Store';

const ApplicationStartUpState: IStore = {
    Global: initialGlobalState,
    Welcome: initialWelcomeState,
    Keyring: initialKeyringState,
    Terms: initialTermsState,
    Coin: initialCoinState,
    Wallet: initialWalletState,
    Option: initialOptionState
};

export default ApplicationStartUpState;