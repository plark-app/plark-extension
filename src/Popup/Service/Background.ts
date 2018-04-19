import Extberry from 'extberry';
import {createDebugger} from "Core/Debugger";

const debug = createDebugger('SEND_REQUEST');

export function sendRequest(type: any | string, payload: any = null): Promise<any> {
    const message = {
        type: type,
        payload: payload || null
    };

    /**
     * @param resolve
     * @param reject
     */
    const promiseResolver = (resolve, reject) => {

        /**
         * @param response
         */
        const responseHandler = (response) => {

            debug(response);

            // @TODO Have to check response data and something else
            if (!response) {
                return;
            }

            if ("error" in response) {
                reject(response.error);

                return;
            }

            if ("data" in response) {
                resolve(response.data);
            }
        };

        Extberry.runtime.sendMessage(message, responseHandler);
    };

    return new Promise<any>(promiseResolver);
}