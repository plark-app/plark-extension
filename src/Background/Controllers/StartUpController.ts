import {Store} from "redux";

import {IStore} from "Core/Declarations/Store";
import {EventHandlerType, IBackgroundCore} from 'Core/Declarations/Service';
import {StartUpEvent} from 'Core/Actions/Controller';
import {GlobalAction, WelcomeAction, KeyringAction} from 'Core/Actions/Reducer';
import {generateSeedVault} from "Core/Service/SeedVault";
import {AbstractController} from 'Background/Service/AbstractController'
import {KeyringController, WalletController} from "Background/Controllers";

export class StartUpController extends AbstractController {

    public constructor(app: IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.bindEventListener(StartUpEvent.Prepare, this.prepare);
    }

    public get alias(): string {
        return 'START_UP';
    }

    /**
     * @returns {any}
     */
    private prepare: EventHandlerType = (): any => {

        const {Welcome} = this.getState();

        const keyringController: KeyringController = this.getApp().get("KEYRING") as KeyringController;
        const walletController: WalletController = this.getApp().get("WALLET") as WalletController;

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
