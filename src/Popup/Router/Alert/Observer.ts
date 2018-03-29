import debugProvider from 'debug';

const debug = debugProvider('ALERT');


export interface IAlert {
    message: string;
    type: string;
    time: number;
    lifetime?: number;
}

const ALERT_LIFETIME = 10000;

export class AlertObserver {

    protected rootComponent;
    protected currentAlert: IAlert;
    protected timeoutToClear;

    /**
     * @param {string} message
     * @param {string} type
     * @param {number} lifetime
     */
    open(message: string, type: string, lifetime: number = null): void {
        if (this.currentAlert) {
            return;
        }

        this.currentAlert = {
            message: message,
            type: type,
            time: new Date().getTime(),
            lifetime: lifetime || ALERT_LIFETIME
        };

        this.setAlert(this.currentAlert);
    }

    /**
     * @returns {Promise<boolean>}
     */
    close(): Promise<boolean> {

        this.currentAlert = null;
        this.setAlert(null);
        clearTimeout(this.timeoutToClear);

        return new Promise<boolean>((resolve) => {

            setTimeout(resolve, 400);
        });
    }

    /**
     * @param {IAlert} alert
     */
    setAlert(alert: IAlert = null) {
        this.rootComponent.setState(() => ({alert: alert}));

        if (alert) {
            this.timeoutToClear = setTimeout(() => {
                this.close();
            }, alert.lifetime);
        }
    }

    setRootComponent(rootComponent) {
        this.rootComponent = rootComponent;
    }
}

export const alertManager = new AlertObserver();
