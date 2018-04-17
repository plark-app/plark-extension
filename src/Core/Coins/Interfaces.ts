import {Coin} from "@berrywallet/core";
import {CoinSymbol, FiatSymbol} from "./Symbols";

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

    getExplorerHost(): string;

    generateAddrLink(address: string): string;

    generateTxLink(txid: string): string;
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