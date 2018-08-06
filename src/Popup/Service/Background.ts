import Extberry from 'extberry';
import { createDebugger } from 'Core';
import { has } from 'lodash';

const debug = createDebugger('SEND_REQUEST');

export interface IBackgroundResponse {
    data?: any;
    error?: {
        message: string;
        code?: any;
        name?: string;
    }
}

export interface IBackgroundRequestMessage {
    type: string;
    payload?: any;
}

export class BackgroundResponseError extends Error {

    protected _response: IBackgroundResponse;
    protected _request: IBackgroundRequestMessage;

    constructor(response: IBackgroundResponse, request: IBackgroundRequestMessage) {
        super(response.error.message);

        this._response = response;
        this._request = request;
    }

    public get response(): IBackgroundResponse {
        return this._response;
    }

    public get request(): IBackgroundRequestMessage {
        return this._request;
    }
}

export function sendRequest<C = any>(type: any | string, payload: any = null): Promise<C> {
    const message: IBackgroundRequestMessage = {
        type: type,
        payload: payload || null,
    };

    const promiseResolver = (resolve, reject) => {
        const responseHandler = (response?: IBackgroundResponse) => {
            // @TODO Have to check response data and something else
            if (!response) {
                return;
            }

            if (has(response, 'error')) {
                const error = new BackgroundResponseError(response, message);
                debug(`Error message: ${error.message}`, message, response);
                reject(error);
            }

            if (has(response, 'data')) {
                resolve(response.data);
            }
        };

        Extberry.runtime.sendMessage(message, responseHandler);
    };

    return new Promise<C>(promiseResolver);
}