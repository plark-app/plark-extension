import {createStore, applyMiddleware} from 'redux';

import stateStorage from 'Core/StateStorage';
import StateObserver from 'Core/Service/StateObserver';
import rootReducer from 'Core/Reducer';

import {loggerMiddleware} from 'Core/Store/Middleware/LoggerMiddleware';

const stateObserver = new StateObserver();
const initialState = stateObserver.loadStateFromPersistence(stateStorage);

const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        loggerMiddleware
    )
);

export default store;