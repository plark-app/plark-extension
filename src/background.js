import './polyfill';
import Extberry from 'extberry';
import { initializeBackgroundApplication } from 'Background/application';

document.addEventListener('DOMContentLoaded', initializeBackgroundApplication);

Extberry.runtime.onInstalled.addListener((event) => {
    switch (event.reason) {
        case 'install':
            // @TODO We should open website page only on install from WEBStore page
            // Extberry.openTab({url: 'https://berrywallet.io'});
            break;

        case 'update':
            break;
    }
});


if (process.env.NODE_ENV === 'development') {
    console.log('DEVELOPMENT MODE!');

    const options = {
        path: {
            '38': '/images/dev-logo-38.png',
            '128': '/images/dev-logo-128.png'
        }
    };

    Extberry.getExtension().browserAction.setIcon(options);
}
