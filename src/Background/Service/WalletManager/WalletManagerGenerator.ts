import {Wallet} from '@berrywallet/core';

import {Coins, createDebugger, Actions, Wallet as CoreWallet} from "Core";
import {NeedPasswordError} from "Background/Errors";
import {WalletController} from "Background/Controllers";

import {WalletManager} from "./";


export interface IWalletManagerGenerator {
    /**
     * @returns {Promise<WalletManager>}
     */
    generate(): Promise<WalletManager>;
}

export class WalletManagerGenerator implements IWalletManagerGenerator {

    protected coin: Coins.CoinInterface;
    protected controller: WalletController;
    protected debug;

    /**
     * @param {CoinInterface} coin
     * @param {WalletController} controller
     */
    constructor(coin: Coins.CoinInterface, controller: WalletController) {
        this.coin = coin;
        this.controller = controller;
        this.debug = createDebugger("WD_Generator:" + this.coin.getUnit());
    }

    /**
     * @returns {Promise<WalletManager>}
     */
    public generate(): Promise<WalletManager> {

        this.debug("Creating WalletManager for coin: " + this.coin.getKey());
        const extractingResolver = this.extractWDFromStorage();

        if (extractingResolver) {
            return extractingResolver.then(this.readyWalletData);
        }

        this.debug("Start generation for coin: " + this.coin.getKey());

        let wdGenerator: Wallet.Generator.IWDGenerator = null;
        try {
            const seed = this.controller.getSeed();
            wdGenerator = CoreWallet.createWDGenerator(this.coin, seed);
        } catch (error) {
            this.debug("Error on data generating", error);
            if (error instanceof NeedPasswordError) {
                // @TODO Need some code
            }

            return Promise.reject(error);
        }

        const filledWalletData = (wdProvider: Wallet.Provider.WDProvider) => {
            const actionPayload = {
                walletCoinKey: this.coin.getKey(),
                walletData: wdProvider.getData()
            };

            this.controller.dispatchStore(Actions.Reducer.WalletAction.Activate, actionPayload);
            this.controller.stopWalletLoading(this.coin);

            return wdProvider;
        };

        return wdGenerator.fill().then(filledWalletData).then(this.readyWalletData);
    }

    /**
     * @returns {Promise<WDProvider> | null}
     */
    protected extractWDFromStorage(): Promise<Wallet.Provider.WDProvider> | null {
        this.debug("Start extracting WD from storage for coin: " + this.coin.getKey());

        let iCoinWallet,
            walletData: Wallet.Entity.WalletData = null;

        try {
            iCoinWallet = this.controller.getWalletData(this.coin.getKey());
            walletData = iCoinWallet.walletData;
        } catch (error) {
            this.debug("Extracting error", error);

            return null;
        }

        if (!walletData) {
            return null;
        }

        const wdProvider = new Wallet.Provider.WDProvider(walletData);
        this.controller.startWalletLoading(this.coin);
        wdProvider.getUpdater().update().then(() => {
            this.controller.stopWalletLoading(this.coin);
        });

        return Promise.resolve(wdProvider);
    }

    protected readyWalletData = (wdProvider: Wallet.Provider.WDProvider): Promise<WalletManager> => {
        return Promise.resolve(new WalletManager(
            wdProvider,
            this.coin,
            this.controller
        ));
    }

}
