export interface RateResponse {
    pair: string;
    rate: number | string;
}


export interface LimitResponse {
    pair: string;
    limit: number | string;
}


export interface MarketInfo {
    pair: string;
    rate: number;
    limit: number;
    min: number;
    minerFee: number;
}


export enum CoinStatus {
    Available = "available",
    Unavailable = "unavailable"
}


export interface CoinInfo {
    name: string;
    symbol: string;
    image: string;
    imageSmall: string;
    status: CoinStatus;
    minerFee: number;
    specialReturn?: boolean;
    specialOutgoing?: boolean;
    specialIncoming?: boolean;
    fieldName?: string;
    fieldKey?: string;
    qrName?: string;
}


export interface RecentTx {
    curIn: string;
    curOut: string;
    timestamp: number;
    amount: number;
    txid: number;       //What a Fuck???
}


export interface TxStatus {
    status: string;
    address?: string;
    withdraw?: string;
    incomingCoin?: number | string;
    incomingType?: string;
    outgoingCoin?: number | string;
    outgoingType?: string;
    transaction?: string;
    transactionURL?: string;
    error?: string;
}


export interface ShiftResponse {
    deposit: string;
    depositType: string;
    withdrawal: string;
    withdrawalType: string;
    public?: string;
    xrpDestTag?: string;
    apiPubKey?: string;
}