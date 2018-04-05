import {Store} from "redux";
import {createBeShapy, BeShapyClient} from 'BeShapy';
import {IStore} from "Core/Declarations/Store";
import {EventHandlerType, IBackgroundCore} from 'Core/Declarations/Service';
import {Controller} from 'Core/Actions';
import {AbstractController} from 'Background/Service/AbstractController';

export class ExchangeController extends AbstractController {

    beShapy: BeShapyClient;

    get alias(): string {
        return 'EXCHANGE';
    }

    /**
     * @param {IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    constructor(app: IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.beShapy = createBeShapy();

        this.bindEventListener(Controller.Exchange.GetPair, this.getPair);
    }

    /**
     * @param request
     * @returns {any}
     */
    private getPair: EventHandlerType = (request: any): any => {
        const {from, to} = request;

        return this.beShapy.getInfo(from, to);
    }
}
