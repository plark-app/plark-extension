const debug = require('debug');

export function createDebugger(key: string) {
    return debug(`berrywallet:${key}`);
}