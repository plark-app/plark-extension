import LocalStorageStore from 'obs-store/lib/localStorage';
import { STATE_STORAGE_KEY } from 'Core/Constant';

export const stateStorage = new LocalStorageStore({
    storageKey: STATE_STORAGE_KEY,
});
