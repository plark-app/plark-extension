import debugProvider from 'debug';

const debugDispatch = debugProvider('store:dispatching');
const debugNewState = debugProvider('store:new_state');

export const loggerMiddleware = store => next => action => {
    debugDispatch(action);
    let result = next(action);
    debugNewState(store.getState());

    return result;
};