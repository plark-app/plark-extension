import Extberry from 'extberry';
import {IBerryNotification} from "./IBerryNotification";
import {TransactionNotification} from "./TransactionNotification";

export function sendNotification(notifyObject: IBerryNotification): Promise<string> {

    const extNotify = Extberry.notifications;

    return new Promise<string>((resolve, reject) => {

        const notifyId = notifyObject.getNotificationId();
        const notifyOptions = notifyObject.getOption();

        try {
            extNotify.create(notifyId, notifyOptions, (notificationId: string) => {
                const clickEventHandler = notifyObject.getClickEvent();
                if (clickEventHandler) {
                    const clickHandler = (clickedNotifyId: string) => {
                        if (clickedNotifyId === notificationId) clickEventHandler();
                    };

                    extNotify.onClicked.addListener(clickHandler);
                    extNotify.onClosed.addListener((ntfId) => {
                        extNotify.onClicked.removeListener(clickHandler);
                    });
                }

                notifyObject.callCallback(notificationId);
                resolve(notificationId);
            });
        } catch (error) {
            reject(error);
        }
    });
}


export {
    TransactionNotification
}