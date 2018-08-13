import { createStore, applyMiddleware } from 'redux';

import rootReducer from 'Core/Reducer';
import { stateStorage } from './StateStorage';
import { loadStateFromPersistence } from './StateObserver';
import { loggerMiddleware } from './middleware';

export const initialState = loadStateFromPersistence(stateStorage);

export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        loggerMiddleware,
    ),
);

export {
    stateStorage,
};