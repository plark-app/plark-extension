
import {IStore} from "./Declarations/Store";

declare global {

    type DummyCallable<R> = (...data: any[]) => R;

    export interface Window {
        getState(): IStore;
        browser: any;
    }
}