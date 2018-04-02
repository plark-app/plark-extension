import debugProvider from 'debug';

const debugStore = debugProvider('berrywallet:store');

export const loggerMiddleware = store => next => action => {
    debugStore("ACTION", action);
    let result = next(action);
    debugStore("NEW_STATE", store.getState());

    return result;
};