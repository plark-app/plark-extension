import {includes, each, Dictionary} from 'lodash';
import {Store} from "redux";
import BigNumber from "bignumber.js";
import {WalletManager} from "Background/Service/WalletManager";
import {Actions, Coins} from "Core";
import {IStore} from 'Core/Declarations/Store';
import {ICoinWallet} from 'Core/Declarations/Wallet';
import {IBackgroundCore} from 'Core/Declarations/Service';
import {AbstractController} from 'Background/Service/AbstractController';
import KeyringController from './KeyringController';


export default class WalletController extends AbstractController {
    protected walletManagers: Dictionary<WalletManager> = {};

    /**
     * @param {IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    constructor(app: IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        each(this.getState().Coin.coins, (coinSymbol: Coins.CoinSymbol) => {
            this.resolveWalletManager(coinSymbol);
        });

        this.bindEventListener(Actions.Controller.WalletEvent.ActivateCoin, (request: any): any => {
            return this.activateWallet(request.coin);
        });

        this.bindEventListener(Actions.Controller.WalletEvent.DisActivateCoin, (request: any): any => {
            return this.disActivateWallet(request.coin);
        });

        this.bindEventListener(Actions.Controller.WalletEvent.CreateTransaction, this.createTransaction);

        this.bindEventListener(Actions.Controller.WalletEvent.CalculateFee, this.calculateFee);
    }

    /**
     * @returns {string}
     */
    static getAlias(): string {
        return 'WALLET';
    }

    /**
     * @returns {KeyringController}
     */
    protected getKeyringController(): KeyringController {
        return this.getApp().get(KeyringController.getAlias()) as KeyringController;
    }

    /**
     * @returns {Buffer}
     */
    getSeed(): Buffer {
        const keyringController: KeyringController = this.getKeyringController();

        return keyringController.getBufferSeed();
    }

    /**
     * @param {CoinSymbol} coinKey
     * @returns {ICoinWallet}
     */
    getWalletData(coinKey: Coins.CoinSymbol): ICoinWallet {
        if (coinKey in this.getState().Wallet) {
            return this.getState().Wallet[coinKey];
        }

        throw new Error('No wallet data');
    }

    /**
     * @param {CoinSymbol} coinKey
     * @returns {WalletManager}
     */
    getWalletManager(coinKey: Coins.CoinSymbol): WalletManager {
        const walletManager = this.walletManagers[coinKey];

        if (!walletManager) {
            throw new Error(`Wallet of Coin '${coinKey}' is not initialized`);
        }

        return walletManager;
    }

    /**
     * @param {CoinSymbol} coinKey
     */
    protected resolveWalletManager(coinKey: Coins.CoinSymbol) {
        if (!(coinKey in this.getState().Wallet)) {
            const actionPayload = {
                walletCoinKey: coinKey,
                walletData: null
            };

            this.dispatchStore(Actions.Reducer.WalletAction.InitWallet, actionPayload);
        }

        const coin = Coins.findCoin(coinKey);
        this.walletManagers[coinKey] = new WalletManager(coin, this);
    }

    /**
     * Action
     *
     * @param {CoinSymbol} coinKey
     */
    activateWallet(coinKey: Coins.CoinSymbol): boolean {
        const newCoins: Coins.CoinSymbol[] = [...this.getState().Coin.coins];

        if (newCoins.includes(coinKey)) {
            return;
        }

        newCoins.push(coinKey);

        this.resolveWalletManager(coinKey);
        this.dispatchStore(Actions.Reducer.CoinAction.SetCoins, {coins: newCoins});

        return true;
    }

    /**
     * @param {CoinSymbol} coinKey
     */
    protected deleteWalletManager(coinKey: Coins.CoinSymbol) {
        const walletManager: WalletManager = this.walletManagers[coinKey];
        if (walletManager) {
            walletManager.destruct();
            delete this.walletManagers[coinKey];
        }
    };

    /**
     * @param {CoinSymbol} coinKey
     */
    disActivateWallet(coinKey: Coins.CoinSymbol): boolean {
        let newCoins: Coins.CoinSymbol[] = [...this.getState().Coin.coins];
        if (!includes(newCoins, coinKey)) {
            return;
        }

        newCoins = newCoins.filter((coin) => coin !== coinKey);
        this.deleteWalletManager(coinKey);
        this.dispatchStore(Actions.Reducer.CoinAction.SetCoins, {coins: newCoins});

        return true;
    }

    /**
     * Action to create transaction
     *
     * @param request
     */
    protected createTransaction = (request: any) => {
        const {coinKey, address, value} = request;

        const fee = this.getState().Option.fee;

        return this.getWalletManager(coinKey).sendTransaction(address, value, fee);
    };

    /**
     * Action to create transaction
     *
     * @param request
     */
    protected calculateFee = (request: any) => {
        const {coinKey, address, value} = request;

        const fee = this.getState().Option.fee;

        return this.getWalletManager(coinKey)
            .calculateFee(address, value, fee)
            .then((fee: BigNumber) => {
                return {
                    fee: fee.toNumber()
                }
            });
    };

    clearAllWallets() {
        each(Object.keys(this.walletManagers), (coinKey: Coins.CoinSymbol) => {
            this.deleteWalletManager(coinKey);
        });
    }
}
