import {BeShapyClient} from "./client";
import * as Units from "./units";

function createBeShapy(apiKey?: string, apiSecret?: string): BeShapyClient {
    return new BeShapyClient(apiKey, apiSecret);
}


export {
    createBeShapy,
    Units,
    BeShapyClient
}