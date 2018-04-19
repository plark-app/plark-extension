import {Dictionary} from 'lodash';
import {AnyAction, Store} from 'redux';
import {IStore} from 'Core/Declarations/Store';
import {createDebugger} from "Core";
import {IBackgroundCore, IController, EventHandlerType} from 'Core/Declarations/Service';

// @TODO Need implement real Store state interface
export abstract class AbstractController implements IController {

    public store: Store<IStore>;
    public app: IBackgroundCore;
    protected debug: (...param: any[]) => void;

    public eventListeners: Dictionary<EventHandlerType> = {};

    /**
     * @param {IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    constructor(app: IBackgroundCore, store: Store<IStore>) {
        this.app = app;
        this.store = store;
        this.debug = createDebugger(this.constructor.name);
    }

    /**
     * @param {string} event
     * @param {EventHandlerType} eventCallback
     */
    protected bindEventListener(event: string, eventCallback: EventHandlerType) {
        this.eventListeners[event] = eventCallback;
    }

    public get alias(): string {
        throw new Error("Alias must be implement!");
    }

    /**
     * @returns {Dictionary<EventHandlerType>}
     */
    public getEventListeners(): Dictionary<EventHandlerType> {
        return this.eventListeners;
    }

    /**
     * @returns {IBackgroundCore}
     */
    public getApp(): IBackgroundCore {
        return this.app;
    }

    /**
     * @param {string} type
     * @param {object} payload
     */
    public dispatchStore(type: string, payload: any = null) {
        const action: AnyAction = Object.assign({type: type}, payload);
        this.store.dispatch.call(this, action);
    }

    /**
     * @returns {IStore}
     */
    public getState(): IStore {
        return this.store.getState();
    }

    /**
     * @param {() => void} listener
     */
    public storeSubscribe(listener: () => void) {
        this.store.subscribe(listener);
    }
}
