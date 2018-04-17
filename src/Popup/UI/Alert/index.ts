import {alertObserver, IAlert, ShowAlertOptions} from './Observer';
import {AlertRootComponent} from "./AlertRootComponent";

import './alert.scss';

function showAlert(options: ShowAlertOptions | string) {
    if (typeof options === 'string') {
        options = {
            message: options
        };
    }

    alertObserver.show(options);
}

function closeAlert(): Promise<void> {
    return alertObserver.close();
}

export {
    IAlert,
    ShowAlertOptions,

    showAlert,
    closeAlert,
    alertObserver,
    AlertRootComponent
}