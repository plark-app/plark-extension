import {BeShapyClient} from "./client";
import * as BeShapyUnits from "./units";

function createBeShapy(apiKey?: string, apiSecret?: string): BeShapyClient {
    return new BeShapyClient(apiKey, apiSecret);
}

export {
    createBeShapy,
    BeShapyUnits,
    BeShapyClient
}