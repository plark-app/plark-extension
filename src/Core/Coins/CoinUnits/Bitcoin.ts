import { Coin } from '@berrywallet/core';
import { CoinSymbol } from '../Symbols';
import { AbstractUnit } from './AbstractUnit';

export default class Bitcoin extends AbstractUnit {

    public constructor() {
        super();

        this.key = CoinSymbol.Bitcoin;
        this.unit = Coin.Unit.BTC;
        this.name = "Bitcoin";
        this.alias = "bitcoin";
        this.color = "#F7931A";
        this.decimal = 8;
    }

    public getFee(): number {
        return 0.00085;
    }

    public getExplorerOrigin(): string {
        return 'https://blockchain.info';
    }
}