import debugProvider from 'debug';
import {EventEmitter} from 'events';

const debug = debugProvider('ALERT');

export interface ShowAlertOptions {
    message: string;
    type?: string;
    onClose?: () => void;
    lifetime?: number;
    noBody?: boolean;
}

export interface IAlert {
    message: string;
    type: string;
    onClose?: () => void;
    lifetime?: number;
    noBody: boolean;

    time: number;
    tokenToClear?: any;
}

const ALERT_LIFETIME = 10000;

export class AlertObserver extends EventEmitter {

    /**
     * @param {ShowAlertOptions} alertProps
     */
    show(alertProps: ShowAlertOptions): void {
        const alert: IAlert = {
            message: alertProps.message,
            type: alertProps.type || 'warning',
            noBody: alertProps.noBody || false,
            onClose: alertProps.onClose || null,
            lifetime: alertProps.lifetime || ALERT_LIFETIME,

            time: new Date().getTime(),
            tokenToClear: null
        };

        debug('show', alert);

        this.emit('show', alert);
    }

    /**
     * @returns {Promise<boolean>}
     */
    close(): Promise<void> {
        this.emit('close');
        debug('close');

        return new Promise<void>((resolve) => {
            setTimeout(resolve, 400);
        });
    }

    /**
     * @param {(alert: IAlert) => void} eventHandler
     */
    onShow(eventHandler: (alert: IAlert) => void) {
        this.on('show', eventHandler);
    }

    /**
     * @param {() => void} eventHandler
     */
    onClose(eventHandler: () => void) {
        this.on('close', eventHandler);
    }
}

export const alertObserver = new AlertObserver();
