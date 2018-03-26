import {STORE_KEY} from 'Core/Constant'

import {Store} from 'react-chrome-redux';
import {IStore} from 'Core/Declarations/Store';

const proxyStore = new Store({
    portName: STORE_KEY
});

export default proxyStore;

export const getState = (): IStore => proxyStore.getState();