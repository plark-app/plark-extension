import { IStore } from 'Core/Declarations/Store';

declare global {
    namespace Store {
        type TStore = IStore;
    }
}
