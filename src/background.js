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


if (process.env.NODE_ENV === 'development') {
    console.log('DEVELOPMENT MODE!');

    const options = {
        path: {
            "38": "/images/dev-logo-38.png",
            "128": "/images/dev-logo-128.png"
        }
    };

    Extberry.getExtension().browserAction.setIcon(options, (...data) => {
        console.log(data);
    });
}