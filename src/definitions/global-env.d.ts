declare global {
    type ReactRef<T extends Element> = T | null;
    type ReactRefHandler<T extends Element> = (ref: ReactRef<T>) => void;
    type Diff<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
    type Omit<T, K> = Pick<T, keyof Diff<T, K>>;

    type DummyCallable<R> = (...data: any[]) => R;

    interface Window {
        browser: any;
    }

    interface IRuntimeRequest {
        type: string
        payload: any | undefined
    }

    type EventListenerType = (request: IRuntimeRequest, sender: any, sendResponse) => void | any;
    type EventHandlerType = <T>(request: any, sender: any) => Promise<T> | any;
}

export {};
