import {Coin} from "@plark/wallet-core";
import {CoinSymbol} from "../Symbols";
import {AbstractUnit} from "./AbstractUnit";

export default class LitecoinTest extends AbstractUnit {

    constructor() {
        super();

        this.key = CoinSymbol.LitecoinTest;
        this.unit = Coin.Unit.LTCt;
        this.name = "Litecoin Test";
        this.alias = "litecoin-test";
        this.color = "#FF3974";
        this.decimal = 8;
    }

    isTest(): boolean {
        return true;
    }

    getFee(): number {
        return 0.003;
    }

    getExplorerOrigin(): string {
        return 'https://ltct.insight.plark.io/';
    }
}