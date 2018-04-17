import {createStore, applyMiddleware} from 'redux';

import rootReducer from 'Core/Reducer';
import {stateStorage} from './StateStorage';
import {loadStateFromPersistence} from './StateObserver';
import {loggerMiddleware} from './Middleware';

const initialState = loadStateFromPersistence(stateStorage);

const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        loggerMiddleware
    )
);

export {
    store,
    stateStorage
}