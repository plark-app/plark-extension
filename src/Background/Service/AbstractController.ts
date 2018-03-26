import {Dictionary} from 'lodash';
import {AnyAction, Store} from 'redux';
import {IStore} from 'Core/Declarations/Store';
import {IBackgroundCore, IController, EventHandlerType} from 'Core/Declarations/Service';

// @TODO Need implement real Store state interface
export abstract class AbstractController implements IController {

    store: Store<IStore>;
    app: IBackgroundCore;

    eventListeners: Dictionary<EventHandlerType> = {};

    /**
     * @param {IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    constructor(app: IBackgroundCore, store: Store<IStore>) {
        this.app = app;
        this.store = store;
    }

    /**
     * @param {string} event
     * @param {EventHandlerType} eventCallback
     */
    protected bindEventListener(event: string, eventCallback: EventHandlerType) {
        this.eventListeners[event] = eventCallback;
    }

    /**
     * @returns {Dictionary<EventHandlerType>}
     */
    getEventListeners(): Dictionary<EventHandlerType> {
        return this.eventListeners;
    }

    /**
     * @returns {IBackgroundCore}
     */
    getApp(): IBackgroundCore {
        return this.app;
    }

    /**
     * @param {string} type
     * @param {object} payload
     */
    dispatchStore(type: string, payload: any = null) {
        const action: AnyAction = Object.assign({type: type}, payload);
        this.store.dispatch.call(this, action);
    }

    /**
     * @returns {IStore}
     */
    getState(): IStore {
        return this.store.getState();
    }

    /**
     * @param {() => void} listener
     */
    storeSubscribe(listener: () => void) {
        this.store.subscribe(listener);
    }
}
