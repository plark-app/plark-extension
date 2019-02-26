import proxyStore from './Store';
import { IStore } from 'Core/Declarations/Store';
import * as Selector from './Selector';
import * as Helpers from './Helpers';

export const getState = (): IStore => proxyStore.getState();

export default proxyStore;

export { Selector, Helpers };
