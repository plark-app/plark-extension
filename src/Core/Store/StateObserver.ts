import LocalStorageStore from 'obs-store/lib/localStorage';
import {applicationStartUpState} from './ApplicationStartUpState';
import {IStore} from 'Core/Declarations/Store';

interface IApplicationStorage {
    meta: {
        version: number
        firstStartTime: string
    };

    data: IStore;
}

/**
 * @param initState
 * @returns {{meta: {version: number, firstStartDate: string}, data: {}}}
 */
export function generateInitialState(initState: IStore): IApplicationStorage {
    return {
        meta: {
            version: 1,
            firstStartTime: (new Date).toTimeString(),
        },
        data: initState
    }
}

/**
 * @param storage
 * @returns {any}
 */
export function loadStateFromPersistence(storage: LocalStorageStore): any {
    const initialState: any = generateInitialState(applicationStartUpState);

    let versionedData: IApplicationStorage = Object.assign(
        {},
        initialState,
        storage.getState()
    );

    storage.putState(versionedData);

    return versionedData.data
}