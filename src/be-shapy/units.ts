export type Rate = {
    pair: string;
    rate: number | string;
};

export type Limit = {
    pair: string;
    limit: number | string;
};

export type MarketInfo = {
    limit: number;
    maxLimit: number;
    minerFee: number;
    minimum: number;
    pair: string;
    rate: number;
};

export enum BeShapyCoinStatus {
    Available = "available",
    Unavailable = "unavailable"
}

export type CoinInfo = {
    name: string;
    symbol: string;
    image: string;
    imageSmall: string;
    status: BeShapyCoinStatus;
    minerFee: number;
    specialReturn?: boolean;
    specialOutgoing?: boolean;
    specialIncoming?: boolean;
    fieldName?: string;
    fieldKey?: string;
    qrName?: string;
};

export type RecentTx = {
    curIn: string;
    curOut: string;
    timestamp: number;
    amount: number;

    /**
     * What a Fuck???
     */
    txid: number;
};

export type TxStatus = {
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
};

export type Shift = {
    deposit: string;
    depositType: string;
    withdrawal: string;
    withdrawalType: string;
    public?: string;
    xrpDestTag?: string;
    apiPubKey?: string;
};
