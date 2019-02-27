import {Coin} from "@plark/wallet-core";
import {CoinSymbol} from "../Symbols";
import {AbstractUnit} from "./AbstractUnit";

export default class EthereumTest extends AbstractUnit {

    constructor() {
        super();

        this.key = CoinSymbol.EthereumTest;
        this.unit = Coin.Unit.ETHt;
        this.name = "Ethereum Test";
        this.alias = "ethereum-test";
        this.color = "#FF3974";
        this.decimal = 8;
    }

    isTest(): boolean {
        return true;
    }

    getFee(): number {
        return 0.00042;
    }

    getExplorerOrigin(): string {
        return 'https://ropsten.etherscan.io';
    }
}