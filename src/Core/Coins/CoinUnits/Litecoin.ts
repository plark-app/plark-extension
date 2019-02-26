import {Coin} from "@berrywallet/core";
import {CoinSymbol} from "../Symbols";
import {AbstractUnit} from "./AbstractUnit";

export default class Litecoin extends AbstractUnit {

    constructor() {
        super();

        this.key = CoinSymbol.Litecoin;
        this.unit = Coin.Unit.LTC;
        this.name = "Litecoin";
        this.alias = "litecoin";
        this.color = "#CBC6C6";
        this.decimal = 8;
    }

    getFee(): number {
        return 0.003;
    }

    getExplorerOrigin(): string {
        return 'https://live.blockcypher.com/ltc';
    }
}