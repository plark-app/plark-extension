import './polyfill';

import {initializeBackgroundApplication} from 'Background/Application';
import {extensionInstance} from 'Core/Extension';

const debugProvider = require('debug');
debugProvider.enable("berrywallet:*");

document.addEventListener('DOMContentLoaded', initializeBackgroundApplication);

extensionInstance.getRuntime().onInstalled.addListener((event) => {
    switch (event.reason) {
        case 'install':
            extensionInstance.getTabs().create({url: 'https://berrywallet.io'});
            break;

        case 'update':
            break;
    }
});
