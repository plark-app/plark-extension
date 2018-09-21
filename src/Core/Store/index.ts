import LocalStorageStore from 'obs-store/lib/localStorage';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from 'Core/Reducer';
import { IStore } from 'Core/Declarations/Store';
import { applicationStartUpState } from './application-start-up-state';
import { loggerMiddleware } from './middleware';
import { STATE_STORAGE_KEY } from 'Core/Constant';


export interface IApplicationStorage {
    meta: {
        version: number
        firstStartTime: string
    };

    data: IStore;
}


export const stateStorage = new LocalStorageStore({
    storageKey: STATE_STORAGE_KEY,
});


export function generateInitialState(initState: IStore): IApplicationStorage {
    return {
        meta: {
            version: 1,
            firstStartTime: (new Date).toTimeString(),
        },
        data: initState,
    };
}


export function loadStateFromPersistence(storage: LocalStorageStore): any {
    const initialState: any = generateInitialState(applicationStartUpState);
    let versionedData: IApplicationStorage = Object.assign({}, initialState, storage.getState());
    storage.putState(versionedData);

    return versionedData.data;
}


export const initialState = loadStateFromPersistence(stateStorage);


export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        loggerMiddleware,
    ),
);
