import debug, { IDebugger } from 'debug';

export function createDebugger(key: string): IDebugger {
    return debug(`berry:${key}`);
}
