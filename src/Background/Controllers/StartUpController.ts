import {Store} from "redux";

import {IStore} from "Core/Declarations/Store";
import {EventHandlerType, IBackgroundCore} from 'Core/Declarations/Service';
import {StartUpEvent} from 'Core/Actions/Controller';
import {GlobalAction, WelcomeAction, KeyringAction} from 'Core/Actions/Reducer';
import {generateSeedVault} from "Core/Service/SeedVault";
import KeyringController from "Background/Controllers/KeyringController";
import {AbstractController} from 'Background/Service/AbstractController'
import WalletController from "./WalletController";

export default class StartUpController extends AbstractController {

    constructor(app: IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.bindEventListener(StartUpEvent.Prepare, this.prepare);
    }

    static getAlias(): string {
        return 'START_UP';
    }

    /**
     * @returns {any}
     */
    private prepare: EventHandlerType = (): any => {

        const {Welcome} = this.getState();

        const keyringController: KeyringController = this.getApp().get(KeyringController.getAlias()) as KeyringController;
        const walletController: WalletController = this.getApp().get(WalletController.getAlias()) as WalletController;

        const seedWords = Welcome.seed.split(' ');

        const seedVault = generateSeedVault(seedWords, Welcome.passcode);

        this.dispatchStore(KeyringAction.SetSeedVault, {
            vault: seedVault.getVaultData()
        });

        keyringController.setVault(seedVault.getVaultData());
        keyringController.setPassword(Welcome.passcode);
        Welcome.coins.forEach((coin) => {
            walletController.activateWallet(coin);
        });

        this.dispatchStore(GlobalAction.WalletReady);
        this.dispatchStore(WelcomeAction.Clear);

        return {
            message: "WalletManager successful prepared"
        };
    }
}
