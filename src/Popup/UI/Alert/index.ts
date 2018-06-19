import {alertObserver, IAlert, ShowAlertOptions} from './Observer';
import {AlertRootComponent} from "./AlertRootComponent";

import './alert.scss';

export function showAlert(options: ShowAlertOptions | string) {
    if (typeof options === 'string') {
        options = {
            message: options
        };
    }

    alertObserver.show(options);
}

export function closeAlert(): Promise<void> {
    return alertObserver.close();
}

export {
    IAlert,
    ShowAlertOptions,
    alertObserver,
    AlertRootComponent
}
