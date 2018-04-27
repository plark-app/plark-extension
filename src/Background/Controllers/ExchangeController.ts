import {Store} from "redux";
import {HD} from "@berrywallet/core";
import {createBeShapy, BeShapyClient, BeShapyUnits} from 'BeShapy';
import {IStore} from "Core/Declarations/Store";
import {IBackgroundCore} from 'Core/Declarations/Service';
import {Controller} from 'Core/Actions';
import {AbstractController} from 'Background/Service/AbstractController';
import {WalletController} from "./WalletController";


export class ExchangeController extends AbstractController {

    beShapy: BeShapyClient;

    public get alias(): string {
        return 'EXCHANGE';
    }


    /**
     * @param {IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    public constructor(app: IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.beShapy = createBeShapy();

        this.bindEventListener(Controller.Exchange.GetPair, this.getPair);
        this.bindEventListener(Controller.Exchange.TryExchange, this.tryExchange);
    }


    /**
     * @param request
     * @returns {any}
     */
    private getPair: EventHandlerType = (request: any): any => {
        const {from, to} = request;

        return this.beShapy.getInfo(from, to);
    };


    /**
     * @param request
     * @returns {any}
     */
    private tryExchange: EventHandlerType = (request: any): Promise<any> => {
        const {from, to, value} = request;

        const walletController = this.getApp().get('WALLET') as WalletController;

        const fromWallet = walletController.getWalletManager(from);
        const toWallet = walletController.getWalletManager(to);

        const toAddress = toWallet.getWDProvider().address.last(HD.BIP44.AddressType.RECEIVE);
        const returnAddress = fromWallet.getWDProvider().address.last(HD.BIP44.AddressType.RECEIVE);

        if (!toAddress || !returnAddress) {
            if (!toAddress) {
                throw new Error("No to address!");
            }

            if (!returnAddress) {
                throw new Error("No from address!");
            }
        }

        const shiftPromise = this.beShapy.shift(
            from,
            to,
            toAddress.address,
            returnAddress.address
        );

        return shiftPromise.then((shift: BeShapyUnits.Shift) => {
            return walletController.createTransaction({
                coinKey: from,
                address: shift.deposit,
                value: value
            });
        });
    }
}
