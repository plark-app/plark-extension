export interface IBerryNotification {
    getNotificationId(): string | null;

    getOption(): chrome.notifications.NotificationOptions;

    callCallback(notificationId: string): void;

    getClickEvent(): () => void;
}

export abstract class AbstractNotification implements IBerryNotification {
    /**
     * @returns {chrome.notifications.NotificationOptions}
     */
    getOption(): chrome.notifications.NotificationOptions {
        return Object.assign({
            type: this.getType(),
            iconUrl: this.getIconUrl(),
            title: this.getTitle(),
            message: this.getMessage()
        }, this.generateOtherOptions());
    }

    protected getType(): string {
        return 'basic';
    }

    protected getIconUrl(): string {
        return '/images/berrywallet-256.png';
    }

    getNotificationId(): string {
        return null;
    }

    getClickEvent(): () => void {
        return null;
    }

    protected abstract getTitle(): string;

    protected abstract getMessage(): string;

    protected generateOtherOptions(): chrome.notifications.NotificationOptions {
        return {} as chrome.notifications.NotificationOptions;
    }

    callCallback(notificationId: string): void {
        // do something
    }
}
