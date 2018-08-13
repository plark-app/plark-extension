import {Coin} from "@berrywallet/core";
import {CoinSymbol} from "../Symbols";
import {CoinInterface} from "../Interfaces";


export abstract class AbstractUnit implements CoinInterface {
    protected key: CoinSymbol;
    protected unit: Coin.Unit;
    protected name: string;
    protected alias: string;
    protected color: string;
    protected decimal: number;

    abstract getFee(): number;

    abstract getExplorerOrigin(): string;

    getKey(): CoinSymbol {
        return this.key;
    }

    getCoreCoin(): Coin.CoinInterface {
        return Coin.makeCoin(this.getUnit());
    }

    getUnit(): Coin.Unit {
        return this.unit;
    }

    getName(): string {
        return this.name;
    }

    getAlias(): string {
        return this.alias
    }

    getColor(): string {
        return this.color;
    }

    getDecimal(): number {
        return this.decimal;
    }

    isTest(): boolean {
        return false;
    }

    generateAddrLink(addr: string): string {
        return this.getExplorerOrigin() + '/address/' + addr;
    }

    generateTxLink(txid: string): string {
        return this.getExplorerOrigin() + '/tx/' + txid;
    }
}