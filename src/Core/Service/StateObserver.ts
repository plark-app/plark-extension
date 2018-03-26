import LocalStorageStore from 'obs-store/lib/localStorage'
import applicationStartUpState from 'Core/Service/ApplicationStartUpState'
import {IStore} from 'Core/Declarations/Store';

interface ApplicationStorageStateInterface {
    meta: {
        version: number
        firstStartTime: string
    }

    data: IStore
}

class StateObserver {
    /**
     * @param initState
     * @returns {{meta: {version: number, firstStartDate: string}, data: {}}}
     */
    generateInitialState(initState: IStore): ApplicationStorageStateInterface {
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
    loadStateFromPersistence(storage: LocalStorageStore): any {
        const initialState: any = this.generateInitialState(applicationStartUpState);

        let versionedData: ApplicationStorageStateInterface = Object.assign(
            {},
            initialState,
            storage.getState()
        );

        storage.putState(versionedData);

        return versionedData.data
    }
}

export default StateObserver