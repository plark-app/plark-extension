import { BeShapyClient } from './client';
import * as BeShapyUnits from './units';

export function createBeShapy(apiKey?: string, apiSecret?: string): BeShapyClient {
    return new BeShapyClient(apiKey, apiSecret);
}

export {
    BeShapyUnits,
    BeShapyClient,
};
