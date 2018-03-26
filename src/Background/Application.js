import {wrapStore} from 'react-chrome-redux';
import debounce from 'debounce';
import * as BerryWalletCore from '@berrywallet/core';
import {STORE_KEY} from 'Core/Constant';
import stateStorage from 'Core/StateStorage';
import store from 'Core/Store';
import BackgroundCore from 'Background/Controllers/BackgroundCore'
import {generateSeedVault, SeedVaultProvider} from 'Core/Service/SeedVault';

import {
    GlobalController,
    OptionController,
    StartUpController,
    TickerController,
    WalletController,
    KeyringController
} from 'Background/Controllers'

export const initializeBackgroundApplication = () => {

    wrapStore(store, {
        portName: STORE_KEY
    });

    const backgroundCore = new BackgroundCore(store);

    backgroundCore.registerController(KeyringController.getAlias(), KeyringController);
    backgroundCore.registerController(OptionController.getAlias(), OptionController);
    backgroundCore.registerController(StartUpController.getAlias(), StartUpController);
    backgroundCore.registerController(TickerController.getAlias(), TickerController);
    backgroundCore.registerController(WalletController.getAlias(), WalletController);
    backgroundCore.registerController(GlobalController.getAlias(), GlobalController);

    const updateStoreListener = () => {
        const actualState = stateStorage.getState();
        actualState.data = store.getState();

        stateStorage.putState(actualState);
    };

    store.subscribe(debounce(updateStoreListener, 200));

    window.getState = () => {
        return store.getState()
    };

    window.core = BerryWalletCore;
};