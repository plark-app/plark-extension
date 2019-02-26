import { alertObserver, IAlert, ShowAlertOptions } from './observer';
import { AlertRootComponent } from './alert-root-component';

import './alert.scss';

export function showAlert(options: ShowAlertOptions | string) {
    if (typeof options === 'string') {
        options = {
            message: options,
        };
    }

    alertObserver.show(options);
}

export function closeAlert(): Promise<void> {
    return alertObserver.close();
}

export { IAlert, ShowAlertOptions, alertObserver, AlertRootComponent };
