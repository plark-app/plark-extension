import {Coin} from "@berrywallet/core";
import {CoinSymbol, FiatSymbol} from "./Symbols";

export interface CoinInterface {
    getKey(): CoinSymbol;

    getUnit(): Coin.Unit;

    getName(): string;

    getAlias(): string;

    getColor(): string;

    getFee(): number;

    getDecimal(): number;

    isTest(): boolean;

    getExplorerHost(): string;

    generateAddrLink(address: string): string;

    generateTxLink(tx: string): string;
}

export interface TickerInterface {
    key: CoinSymbol;
    priceBtc: number;
    priceFiat: number;
}

export interface FiatInterface {
    key: FiatSymbol
    name: string;
    shortName: string;
    prefix?: string;
    format: string;
}