import { Coin } from '@berrywallet/core';
import { CoinSymbol } from '../Symbols';
import { AbstractUnit } from './AbstractUnit';

export default class BitcoinTest extends AbstractUnit {

    public constructor() {
        super();

        this.key = CoinSymbol.BitcoinTest;
        this.unit = Coin.Unit.BTCt;
        this.name = "Bitcoin Test";
        this.alias = "bitcoin-test";
        this.color = "#FF3974";
        this.decimal = 8;
    }

    public isTest(): boolean {
        return true;
    }

    public getFee(): number {
        return 0.00085;
    }

    public getExplorerOrigin(): string {
        return 'https://test.btc.explorer.berrywallet.io';
    }
}
