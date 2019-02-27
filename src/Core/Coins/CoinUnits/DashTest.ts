import {Coin} from "@plark/wallet-core";
import {CoinSymbol} from "../Symbols";
import {AbstractUnit} from "./AbstractUnit";

export default class DashTest extends AbstractUnit {

    constructor() {
        super();

        this.key = CoinSymbol.DashTest;
        this.unit = Coin.Unit.DASHt;
        this.name = "Dash Test";
        this.alias = "dash-test";
        this.color = "#FF3974";
        this.decimal = 8;
    }

    getFee(): number {
        return 0.02;
    }

    isTest(): boolean {
        return true;
    }

    getExplorerOrigin(): string {
        return 'https://dasht.insight.plark.io';
    }
}
