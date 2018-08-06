import { Store } from 'react-chrome-redux';
import { STORE_KEY } from 'Core/Constant';

const proxyStore = new Store({
    portName: STORE_KEY,
});

export default proxyStore;