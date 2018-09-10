import { CoinInterface } from 'Core/Coins';
import { Wallet, Coin } from '@berrywallet/core';

/**
 * @param {CoinSymbol} coinSymbol
 * @param {Buffer} seed
 */
export function createWDGenerator(coinSymbol: CoinInterface, seed: Buffer): Wallet.Generator.WDGeneratorInterface {
    let coin: Coin.CoinInterface = Coin.makeCoin(coinSymbol.getUnit());

    return Wallet.Generator.createGenerator(coin, seed);
}