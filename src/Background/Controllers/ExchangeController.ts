import {Store} from "redux";
import {IStore} from "Core/Declarations/Store";
import {EventHandlerType, IBackgroundCore} from 'Core/Declarations/Service';
import {Controller} from 'Core/Actions';
import {AbstractController} from 'Background/Service/AbstractController';

export class ExchangeController extends AbstractController {

    get alias(): string {
        return 'EXCHANGE';
    }

    /**
     * @param {IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    constructor(app: IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.bindEventListener(Controller.OptionEvent.SetFee, this.calculateData);
    }

    /**
     * @param request
     * @returns {any}
     */
    private calculateData: EventHandlerType = (request: any): any => {
        const {fee} = request;

        return {
            success: true
        };
    }
}
