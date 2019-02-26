import { Coin } from '@berrywallet/core';
import { CoinSymbol, FiatSymbol } from './Symbols';

export interface CoinInterface {
    getKey(): CoinSymbol;

    getUnit(): Coin.Unit;

    getCoreCoin(): Coin.CoinInterface;

    getName(): string;

    getAlias(): string;

    getColor(): string;

    getFee(): number;

    getDecimal(): number;

    isTest(): boolean;

    getExplorerOrigin(): string;

    generateAddrLink(address: string): string;

    generateTxLink(txid: string): string;
}

export type TickerData = {
    key: CoinSymbol;
    priceBtc: number;
    priceUsd: number;
    priceFiat: number;
};

export type FiatData = {
    key: FiatSymbol
    name: string;
    shortName: string;
    prefix?: string;
    format: string;
};
