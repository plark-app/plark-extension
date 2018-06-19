import {EventEmitter} from 'events';
import {createDebugger} from 'Core';

const debug = createDebugger('ALERT');

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
    onClose?: (...data: any[]) => void;
    lifetime?: number;
    noBody: boolean;

    time: number;
    tokenToClear?: any;
}

const ALERT_LIFETIME = 10000;

export class AlertObserver extends EventEmitter {

    public show(alertProps: ShowAlertOptions): void {
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

    public close(): Promise<void> {
        this.emit('close');
        debug('close');

        return new Promise<void>((resolve) => {
            setTimeout(resolve, 400);
        });
    }

    public onShow(eventHandler: (alert: IAlert) => void) {
        this.on('show', eventHandler);
    }

    public onClose(eventHandler: () => void) {
        this.on('close', eventHandler);
    }
}

export const alertObserver = new AlertObserver();
