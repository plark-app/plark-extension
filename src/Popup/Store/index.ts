import proxyStore from './Store';
import {IStore} from 'Core/Declarations/Store';
import * as Selector from './Selector';
import * as Helpers from './Helpers';

const getState = (): IStore => proxyStore.getState();

export default proxyStore;

export {
    getState,

    Selector,
    Helpers
}