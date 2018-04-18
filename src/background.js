import './polyfill';

import {initializeBackgroundApplication} from 'Background/Application';
import Extberry from 'extberry';

document.addEventListener('DOMContentLoaded', initializeBackgroundApplication);

Extberry.runtime.onInstalled.addListener((event) => {
    switch (event.reason) {
        case 'install':
            Extberry.openTab({url: 'https://berrywallet.io'});
            break;

        case 'update':
            break;
    }
});
