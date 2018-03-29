import {alertManager} from './Observer';
import {AlertRootComponent} from "./AlertRootComponent";

function showAlert(message: string, type: string = 'warning') {
    alertManager.open(message, type);
}

export {
    showAlert,
    alertManager,
    AlertRootComponent
}