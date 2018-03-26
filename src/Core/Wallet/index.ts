import {CoinInterface} from "Core/Coins";
import {Wallet, Coin} from "@berrywallet/core";

/**
 * @param {CoinSymbol} coinSymbol
 * @param {Buffer} seed
 * @returns {WDGenerator}
 */
function createWDGenerator(coinSymbol: CoinInterface, seed: Buffer): Wallet.Generator.WDGenerator {
    let coin: Coin.CoinInterface = Coin.makeCoin(coinSymbol.getUnit());

    return new Wallet.Generator.WDGenerator(coin, seed);
}

export {
    createWDGenerator
}