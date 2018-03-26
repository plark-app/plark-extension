import {Coin} from "@berrywallet/core";
import {CoinSymbol} from "../Symbols";
import {AbstractUnit} from "./AbstractUnit";

export default class Ethereum extends AbstractUnit {

    constructor() {
        super();

        this.key = CoinSymbol.Ethereum;
        this.unit = Coin.Unit.ETH;
        this.name = "Ethereum";
        this.alias = "ethereum";
        this.color = "#627EEA";
        this.decimal = 8;
    }

    getFee(): number {
        return 0.00042;
    }

    getExplorerHost(): string {
        return 'https://etherscan.io';
    }
}