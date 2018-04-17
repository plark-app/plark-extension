import {STORE_KEY} from 'Core/Constant'
import {Store} from 'react-chrome-redux';

const proxyStore = new Store({
    portName: STORE_KEY
});

export default proxyStore;