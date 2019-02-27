import {Coin} from "@plark/wallet-core";
import {CoinSymbol} from "../Symbols";
import {AbstractUnit} from "./AbstractUnit";

export default class Dash extends AbstractUnit {

    constructor() {
        super();

        this.key = CoinSymbol.Dash;
        this.unit = Coin.Unit.DASH;
        this.name = "Dash";
        this.alias = "dash";
        this.color = "#1C75BC";
        this.decimal = 8;
    }

    getFee(): number {
        return 0.02;
    }

    getExplorerOrigin(): string {
        return 'https://live.blockcypher.com/dash';
    }
}