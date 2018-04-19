import {createDebugger} from "Core/Debugger";
const debugStore = createDebugger('store');

export const loggerMiddleware = store => next => action => {
    debugStore("ACTION", action);
    let result = next(action);
    debugStore("NEW_STATE", store.getState());

    return result;
};