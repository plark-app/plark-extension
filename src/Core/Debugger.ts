const debug = require('debug');

export function createDebugger(key: string) {
    return debug(`berry:${key}`);
}