import {IStore} from './Declarations/Store';

declare global {

    type DummyCallable<R> = (...data: any[]) => R;

    interface Window {
        getState(): IStore;

        browser: any;
    }

    interface IRuntimeRequest {
        type: string
        payload: any | undefined
    }

    type EventListenerType = (request: IRuntimeRequest, sender: any, sendResponse) => void | any;
    type EventHandlerType = <T>(request: any, sender: any) => Promise<T> | any;


    namespace Store {
        type TStore = IStore;
    }
}
