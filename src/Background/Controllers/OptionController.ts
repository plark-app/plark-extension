import {Store} from "redux";
import {IStore} from "Core/Declarations/Store";
import {EventHandlerType, IBackgroundCore} from 'Core/Declarations/Service';
import {Reducer, Controller} from 'Core/Actions';
import {AbstractController} from 'Background/Service/AbstractController';

export default class OptionController extends AbstractController {

    /**
     * @param {IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    constructor(app: IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.bindEventListener(Controller.OptionEvent.SetFee, this.setFee);
    }

    static getAlias(): string {
        return 'OPTION';
    }

    /**
     * @param request
     * @returns {any}
     */
    private setFee: EventHandlerType = (request: any): any => {

        const {fee} = request;

        this.dispatchStore(Reducer.OptionAction.SetFee, {fee: fee});

        return {
            success: true
        };
    }
}