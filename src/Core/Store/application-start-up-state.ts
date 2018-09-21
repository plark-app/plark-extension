import {
    initialGlobalState,
    initialTermsState,
    initialCoinState,
    initialWelcomeState,
    initialKeyringState,
    initialWalletState,
    initialOptionState,
} from 'Core/Reducer';

import { IStore } from 'Core/Declarations/Store';

export const applicationStartUpState: IStore = {
    Global: initialGlobalState,
    Welcome: initialWelcomeState,
    Keyring: initialKeyringState,
    Terms: initialTermsState,
    Coin: initialCoinState,
    Wallet: initialWalletState,
    Option: initialOptionState,
};
