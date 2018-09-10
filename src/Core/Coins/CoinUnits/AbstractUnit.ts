import { Coin } from '@berrywallet/core';
import { CoinSymbol } from '../Symbols';
import { CoinInterface } from '../Interfaces';


export abstract class AbstractUnit implements CoinInterface {
    protected key: CoinSymbol;
    protected unit: Coin.Unit;
    protected name: string;
    protected alias: string;
    protected color: string;
    protected decimal: number;

    public abstract getFee(): number;

    public abstract getExplorerOrigin(): string;

    public getKey(): CoinSymbol {
        return this.key;
    }

    public getCoreCoin(): Coin.CoinInterface {
        return Coin.makeCoin(this.getUnit());
    }

    public getUnit(): Coin.Unit {
        return this.unit;
    }

    public getName(): string {
        return this.name;
    }

    public getAlias(): string {
        return this.alias;
    }

    public getColor(): string {
        return this.color;
    }

    public getDecimal(): number {
        return this.decimal;
    }

    public isTest(): boolean {
        return false;
    }

    public generateAddrLink(addr: string): string {
        return this.getExplorerOrigin() + '/address/' + addr;
    }

    public generateTxLink(txid: string): string {
        return this.getExplorerOrigin() + '/tx/' + txid;
    }
}
