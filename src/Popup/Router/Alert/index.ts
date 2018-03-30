import {alertObserver, IAlert, ShowAlertOptions} from './Observer';
import {AlertRootComponent} from "./AlertRootComponent";

function showAlert(options: ShowAlertOptions) {
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