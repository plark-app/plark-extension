import {each} from 'lodash';
import BigNumber from "bignumber.js";
import {Coin, Wallet} from '@berrywallet/core';
import * as Core from "Core";
import {Coins} from "Core";
import WalletController from "Background/Controllers/WalletController";

const debounce = require('debounce');

export class WalletManager {

    protected coin: Coins.CoinInterface;
    protected controller: WalletController;
    protected inited: boolean = false;
    protected _wdProvider: Wallet.Provider.WDProvider;
    protected updaterTimeoutIndex;

    /**
     * @param {CoinInterface} coin
     * @param {WalletController} walletController
     */
    constructor(coin: Coins.CoinInterface, walletController: WalletController) {
        this.coin = coin;
        this.controller = walletController;

        this.init().then((wdProvider) => {
            this._wdProvider = wdProvider;
            this.mapEventsToWDProvider();

            wdProvider.getNetworkProvider().onNewBlock(this.updateCoinKey);

            this.setUpdateTimeout();
        });
    }

    updateCoinKey = (block: Wallet.Entity.Block) => {
        this.controller.dispatchStore(Core.Actions.Reducer.CoinAction.SetBlockHeight, {
            coinKey: this.coin.getKey(),
            blockHeight: block.height
        });
    };

    get wdProvider(): Wallet.Provider.WDProvider {
        if (!this._wdProvider) {
            throw new Error(`WDProvider not inited for coin ${this.coin.getUnit()}`);
        }

        return this._wdProvider;
    }

    get seed(): Buffer {
        return this.controller.getSeed();
    }

    protected init(): Promise<Wallet.Provider.WDProvider> {
        if (this.inited) {
            return;
        }

        this.inited = true;
        console.log("Creating WalletManager for coin: " + this.coin.getKey());

        const extractingResolver = this.extractWDFromStorage();

        if (extractingResolver) {
            return extractingResolver;
        }

        console.log("Start generation for coin: " + this.coin.getKey());

        const wdGenerator = Core.Wallet.createWDGenerator(this.coin, this.seed);
        return wdGenerator.generate().then((wdProvider) => {
            const actionPayload = {
                walletCoinKey: this.coin.getKey(),
                walletData: wdProvider.getData()
            };

            this.controller.dispatchStore(Core.Actions.Reducer.WalletAction.Activate, actionPayload);
            this.stopWalletLoading();

            return wdProvider;
        });
    }

    protected extractWDFromStorage(): Promise<Wallet.Provider.WDProvider> | null {
        console.log("Start extracting WD from storage for coin: " + this.coin.getKey());

        let iCoinWallet,
            walletData: Wallet.Entity.WalletData = null;

        try {
            iCoinWallet = this.controller.getWalletData(this.coin.getKey());
            walletData = iCoinWallet.walletData;
        } catch (error) {
            return null;
        }

        if (!walletData) {
            return null;
        }

        return new Promise<Wallet.Provider.WDProvider>((resolve) => {
            const wdProvider = new Wallet.Provider.WDProvider(walletData);
            this.startWalletLoading();
            wdProvider.getUpdater().update().then(() => {
                this.stopWalletLoading();
            });

            resolve(wdProvider);
        });
    }

    protected startWalletLoading() {
        this.controller.dispatchStore(Core.Actions.Reducer.WalletAction.StartLoading, {
            walletCoinKey: this.coin.getKey()
        });
    }

    protected stopWalletLoading() {
        this.controller.dispatchStore(Core.Actions.Reducer.WalletAction.StopLoading, {
            walletCoinKey: this.coin.getKey()
        });
    }

    protected putNewTx(tx: Wallet.Entity.WalletTransaction): void {
        this.wdProvider.tx.add(tx);
    }

    protected mapEventsToWDProvider() {
        const walletDataSaver = debounce(() => {
            const actionPayload = {
                walletCoinKey: this.coin.getKey(),
                walletData: this.wdProvider.getData()
            };

            this.controller.dispatchStore(Core.Actions.Reducer.WalletAction.SetWalletData, actionPayload);
            this.setUnconfirmedTxTracking();
        }, 300);

        this.wdProvider.onChange(walletDataSaver);

        const trackAddress: string[] = this.wdProvider.address.list().map(addr => addr.address);
        const networkProvider = this.wdProvider.getNetworkProvider();
        networkProvider.onAddrsTx(trackAddress, (tx) => this.putNewTx(tx));

        this.setUnconfirmedTxTracking();
    }

    protected setUnconfirmedTxTracking() {
        const tracker = this.wdProvider.getNetworkProvider().getTracker();

        tracker.removeAllListeners('tx.*');

        each(this.wdProvider.tx.unconfirmedList(), (utx) => {
            tracker.onTransactionConfirm(utx.txid, (tx) => this.putNewTx(tx));
        });
    }

    /**
     * @param {string} address
     * @param {number} value
     * @param {FeeTypes} fee
     *
     * @returns {Promise<WalletTransaction | void>}
     */
    sendTransaction = (address: string, value: number, fee: Coin.FeeTypes = Coin.FeeTypes.Medium) => {
        const bufferSeed = this.seed;

        const privateWallet = this.wdProvider.getPrivate(bufferSeed);
        const parsedAddress = Coin.Helper.parseAddressByCoin(this.wdProvider.getData().coin, address);

        const broadcastTransaction = (transaction: Coin.Transaction.Transaction) => {
            return privateWallet
                .broadcastTransaction(transaction)
                .then((txid) => {
                    return this.trackTransaction(txid)
                        .then((tx) => {
                            this.putNewTx(tx);

                            return tx;
                        })
                })
                .catch((error) => {
                    throw new Error('Error on send transaction');
                });
        };

        return privateWallet
            .createTransaction(parsedAddress, new BigNumber(value), fee)
            .then(broadcastTransaction)
            .catch((error) => {
                throw new Error('Error on create transaction');
            });
    };

    /**
     * @param {string} address
     * @param {number} value
     * @param {FeeTypes} fee
     * @returns {Promise<BigNumber>}
     */
    calculateFee = (address: string, value: number, fee: Coin.FeeTypes = Coin.FeeTypes.Medium) => {
        const bufferSeed = this.seed;

        const privateWallet = this.wdProvider.getPrivate(bufferSeed);
        let parsedAddress = null;

        if (address) {
            try {
                parsedAddress = Coin.Helper.parseAddressByCoin(this.wdProvider.getData().coin, address);
            } catch (error) {
            }
        }

        return privateWallet.calculateFee(new BigNumber(value), parsedAddress, fee);
    };

    /**
     * @param {string} txid
     *
     * @returns {Promise<WalletTransaction>}
     */
    trackTransaction = (txid: string): Promise<Wallet.Entity.WalletTransaction> => {
        const networkProvider = this.wdProvider.getNetworkProvider();

        const resolvePromise = (resolve) => {
            const trackTransactionAction = () => {
                networkProvider.getTx(txid)
                    .then((tx: Wallet.Entity.WalletTransaction | null) => {
                        if (!tx) return trackTransactionAction();
                        resolve(tx);
                    });
            };

            trackTransactionAction();
        };

        return new Promise(resolvePromise);
    };

    isReady(): boolean {
        return this.inited && !!this._wdProvider;
    }

    destruct() {
        if (this._wdProvider) {
            this._wdProvider.destruct();
        }
    }

    protected updateWalletData = () => {
        this._wdProvider.getUpdater().update().then(() => {
            this.setUpdateTimeout();
        });
    };

    protected setUpdateTimeout = () => {
        if (this.updaterTimeoutIndex) {
            clearTimeout(this.updaterTimeoutIndex);
        }

        this.updaterTimeoutIndex = setTimeout(this.updateWalletData, 30 * 60 * 1000);
    }
}
