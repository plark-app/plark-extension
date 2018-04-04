import {BeShapyClient} from "./client";

export function create(apiKey?: string, apiSecret?: string): BeShapyClient {
    return new BeShapyClient(apiKey, apiSecret);
}