import {Store} from "redux";
import {IStore} from "Core/Declarations/Store";
import {IBackgroundCore} from 'Core/Declarations/Service';
import {Reducer, Controller} from 'Core/Actions';
import {AbstractController} from 'Background/Service/AbstractController'
import {WalletController} from "./WalletController";

export class GlobalController extends AbstractController {

    /**
     * @param {IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    public constructor(app: IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.bindEventListener(Controller.GlobalEvent.ClearAllData, this.clearAllData);
    }

    public get alias(): string {
        return 'GLOBAL';
    }

    /**
     * @returns {any}
     */
    private clearAllData: EventHandlerType = (): any => {

        (this.app.get("WALLET") as WalletController).clearAllWallets();

        this.dispatchStore(Reducer.GlobalAction.ClearAllData);

        return {
            success: true
        };
    }
}
