import {includes, each, Dictionary} from 'lodash';
import {Store} from "redux";
import BigNumber from "bignumber.js";
import {WalletManager} from "Background/Service/WalletManager";
import {Actions, Coins} from "Core";
import {IStore} from 'Core/Declarations/Store';
import {ICoinWallet} from 'Core/Declarations/Wallet';
import {AbstractController} from 'Background/Service/AbstractController';
import {KeyringController} from './KeyringController';
import {WalletManagerGenerator} from 'Background/Service/WalletManager/WalletManagerGenerator';

interface CreateTransactionPayload {
    coinKey: Coins.CoinSymbol;
    address: string;
    value: number;
}

export class WalletController extends AbstractController {
    protected walletManagers: Dictionary<WalletManager> = {};

    /**
     * @param {BgController.IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    public constructor(app: BgController.IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.bindEventListener(Actions.Controller.WalletEvent.ActivateCoin, (request: any): any => {
            return this.activateWallet(request.coin);
        });

        this.bindEventListener(Actions.Controller.WalletEvent.DisActivateCoin, (request: any): any => {
            return this.disActivateWallet(request.coin);
        });

        this.bindEventListener(Actions.Controller.WalletEvent.CreateTransaction, this.createTransaction);

        this.bindEventListener(Actions.Controller.WalletEvent.CalculateFee, this.calculateFee);

        each(this.getState().Coin.coins, (coinSymbol: Coins.CoinSymbol) => {
            try {
                this.resolveWalletManager(coinSymbol);
            } catch (error) {
                this.debug(error);
            }
        });
    }

    /**
     * @returns {string}
     */
    public get alias(): string {
        return 'WALLET';
    }

    /**
     * @returns {KeyringController}
     */
    protected getKeyringController(): KeyringController {
        return this.getApp().get("KEYRING") as KeyringController;
    }

    /**
     * @returns {Buffer}
     */
    public getSeed(): Buffer {
        const keyringController: KeyringController = this.getKeyringController();

        return keyringController.getBufferSeed();
    }

    /**
     * @param {CoinSymbol} coinKey
     * @returns {ICoinWallet}
     */
    public getWalletData(coinKey: Coins.CoinSymbol): ICoinWallet {
        if (coinKey in this.getState().Wallet) {
            return this.getState().Wallet[coinKey];
        }

        throw new Error('No wallet data');
    }

    /**
     * @param {CoinSymbol} coinKey
     * @returns {WalletManager}
     */
    public getWalletManager(coinKey: Coins.CoinSymbol): WalletManager {
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

        const coin = Coins.findCoin(coinKey);
        if (!(coin.getKey() in this.getState().Wallet)) {
            this.dispatchStore(Actions.Reducer.WalletAction.InitWallet, {
                coinKey: coin.getKey()
            });
        }

        const wmGenerator = new WalletManagerGenerator(coin, this);

        wmGenerator.generate()
            .then((wm: WalletManager) => {
                this.walletManagers[coinKey] = wm;
            })
            .catch((error: Error) => {
                this.disActivateWallet(coin.getKey());
                this.stopWalletLoading(coin);
            });
    }

    /**
     * Action
     *
     * @param {CoinSymbol} coinKey
     */
    public activateWallet(coinKey: Coins.CoinSymbol): boolean {
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
    protected disActivateWallet(coinKey: Coins.CoinSymbol): boolean {
        let newCoins: Coins.CoinSymbol[] = [...this.getState().Coin.coins];
        if (!includes(newCoins, coinKey)) {
            return;
        }

        newCoins = newCoins.filter((coin) => coin !== coinKey);
        this.dispatchStore(Actions.Reducer.CoinAction.SetCoins, {coins: newCoins});
        this.deleteWalletManager(coinKey);

        return true;
    }

    /**
     * Action to create transaction
     *
     * @param request
     */
    public createTransaction = (request: CreateTransactionPayload) => {
        const {coinKey, address, value} = request;

        const nValue = new BigNumber(value);
        const fee = this.getState().Option.fee;

        return this.getWalletManager(coinKey).sendTransaction(address, nValue, fee);
    };

    public clearAllWallets() {
        each(Object.keys(this.walletManagers), (coinKey: Coins.CoinSymbol) => {
            this.deleteWalletManager(coinKey);
        });
    }

    public startWalletLoading(coin: Coins.CoinInterface) {
        this.dispatchStore(Actions.Reducer.WalletAction.StartLoading, {
            walletCoinKey: coin.getKey()
        });
    }

    public stopWalletLoading(coin: Coins.CoinInterface) {
        this.dispatchStore(Actions.Reducer.WalletAction.StopLoading, {
            walletCoinKey: coin.getKey()
        });
    }

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
}
