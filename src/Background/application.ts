import { wrapStore } from 'react-chrome-redux';
import { debounce } from 'lodash';
import { store, stateStorage } from 'Core/Store';
import { STORE_KEY } from 'Core/Constant';

import {
    BackgroundCore,
    GlobalController,
    OptionController,
    StartUpController,
    TickerController,
    WalletController,
    KeyringController,
    ExchangeController,
} from 'Background/Controllers';

export const initializeBackgroundApplication = (): void => {
    wrapStore(store, {
        portName: STORE_KEY,
    });

    const backgroundCore = new BackgroundCore(store);

    backgroundCore.registerController(KeyringController);
    backgroundCore.registerController(OptionController);
    backgroundCore.registerController(StartUpController);
    backgroundCore.registerController(TickerController);
    backgroundCore.registerController(WalletController);
    backgroundCore.registerController(GlobalController);
    backgroundCore.registerController(ExchangeController);

    const updateStoreListener = () => {
        const actualState = stateStorage.getState();
        actualState.data = store.getState();

        stateStorage.putState(actualState);
    };

    store.subscribe(debounce(updateStoreListener, 200));
};
