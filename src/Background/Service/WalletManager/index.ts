import {each, debounce} from 'lodash';
import BigNumber from "bignumber.js";
import {Coin, Wallet} from '@berrywallet/core';
import * as Core from "Core";
import {Coins, createDebugger, Actions} from "Core";
import {NeedPasswordError} from "Background/Errors";
import {WalletController} from "Background/Controllers";
import {sendNotification, TransactionNotification} from 'Core/Extension/NotificationManager';

const updateBlockTimeout = 20 * 60 * 1000;

export class WalletManager {
    protected debug;
    protected coin: Coins.CoinInterface;
    protected controller: WalletController;
    protected inited: boolean = false;
    protected _wdProvider: Wallet.Provider.WDProvider;
    protected updaterTimeoutIndex;

    protected lastConnectionCheck: Date;

    /**
     * @param {CoinInterface} coin
     * @param {WalletController} walletController
     */
    constructor(coin: Coins.CoinInterface, walletController: WalletController) {
        this.coin = coin;
        this.controller = walletController;
        this.debug = createDebugger('WM:' + this.coin.getUnit());

        const onInitSuccess = (wdProvider: Wallet.Provider.WDProvider) => {
            this._wdProvider = wdProvider;
            this.mapEventsToWDProvider();

            wdProvider.getNetworkProvider().onNewBlock(this.updateBlockInfo);
            wdProvider.getNetworkProvider().getTracker().onConnect(() => {
                if (this.lastConnectionCheck) {
                    const currentTime = new Date().getTime();
                    if (currentTime - this.lastConnectionCheck.getTime() > updateBlockTimeout) {
                        this.updateWalletData();
                    }
                }

                this.lastConnectionCheck = new Date();
            });

            this.setUpdateTimeout();

            wdProvider.on('tx:new', (tx: Wallet.Entity.WalletTransaction) => {

                const balance = this.wdProvider.balance;
                const amount = Wallet.Helper.calculateTxBalance(balance, tx.txid);

                if (amount > 0) {
                    sendNotification(new TransactionNotification(this.coin, tx, amount))
                        .then((notificationId: string) => {
                            this.debug('Showed Notification with ID:' + notificationId);
                        });
                }
            });
        };

        const onInitError = (error) => {
            this.debug("Initialization error", error);
        };

        this.init().then(onInitSuccess, onInitError);
    }

    updateBlockInfo = (block: Wallet.Entity.Block) => {
        this.controller.dispatchStore(Actions.Reducer.CoinAction.SetBlockHeight, {
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

        this.debug("Creating WalletManager for coin: " + this.coin.getKey());

        const extractingResolver = this.extractWDFromStorage();

        if (extractingResolver) {
            return extractingResolver;
        }

        this.debug("Start generation for coin: " + this.coin.getKey());

        let wdGenerator = null;
        try {
            wdGenerator = Core.Wallet.createWDGenerator(this.coin, this.seed);
        } catch (error) {
            this.debug("Error on data generating", error);
            if (error instanceof NeedPasswordError) {
                // @TODO Need some code
            }

            return Promise.reject(error);
        }

        return wdGenerator.fill().then((wdProvider) => {
            this.inited = true;

            const actionPayload = {
                walletCoinKey: this.coin.getKey(),
                walletData: wdProvider.getData()
            };

            this.controller.dispatchStore(Actions.Reducer.WalletAction.Activate, actionPayload);
            this.stopWalletLoading();

            return wdProvider;
        });
    }

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
        this.controller.dispatchStore(Actions.Reducer.WalletAction.StartLoading, {
            walletCoinKey: this.coin.getKey()
        });
    }

    protected stopWalletLoading() {
        this.controller.dispatchStore(Actions.Reducer.WalletAction.StopLoading, {
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

            this.controller.dispatchStore(Actions.Reducer.WalletAction.SetWalletData, actionPayload);
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

        const onBroadcastingError = (error) => {
            this.debug('Error on send transaction', error);

            throw new Error('Error on send transaction');
        };

        const onCreatingError = (error) => {
            this.debug('Error on create transaction', error);

            throw new Error('Error on create transaction');
        };

        const broadcastTransaction = (transaction: Coin.Transaction.Transaction) => {
            const onSuccessBroadcastTx = (txid: string) => {
                const walletTx = Wallet.Helper.coinTxToWalletTx(txid, transaction, this.coin.getCoreCoin());
                this.putNewTx(walletTx);

                return walletTx;
            };

            return privateWallet.broadcastTransaction(transaction)
                .then(onSuccessBroadcastTx, onBroadcastingError)
                .catch(onBroadcastingError);
        };

        return privateWallet.createTransaction(parsedAddress, new BigNumber(value), fee)
            .then(broadcastTransaction, onCreatingError)
            .catch(onCreatingError);
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
                this.debug('Parsing address error', error);
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

            setTimeout(() => {
                trackTransactionAction();
            }, 1000);
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
        try {
            this._wdProvider.getUpdater().update();
        } catch (error) {
            this.debug('Updating error', error);
        }
    };

    protected setUpdateTimeout = () => {
        if (this.updaterTimeoutIndex) {
            clearTimeout(this.updaterTimeoutIndex);
        }

        this.updaterTimeoutIndex = setInterval(this.updateWalletData, 15 * 60 * 1000);
    }
}
