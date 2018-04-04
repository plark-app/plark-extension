import {Store, AnyAction} from 'redux';
import {Dictionary} from 'lodash';
import {IStore} from 'Core/Declarations/Store';

interface IRuntimeRequest {
    type: string
    payload: any | undefined
}

type EventListenerType = (request: IRuntimeRequest, sender: any, sendResponse) => void | any;
type EventHandlerType = <T>(request: any, sender: any) => Promise<T> | any;

type ControllerConstructorType<T> = new (app: IBackgroundCore, store: Store<IStore>) => T;

interface IController {
    store: Store<IStore>;
    app: IBackgroundCore;

    readonly alias: string;

    getEventListeners(): Dictionary<EventHandlerType>;

    dispatchStore(type: string, payload: any);

    getState(): IStore;

    storeSubscribe(listener: (...any) => void);
}

interface IBackgroundCore {
    controllers: IController[];

    registerController<T extends IController>(c: ControllerConstructorType<T>): void;

    get(alias: string): IController;
}

export {
    IRuntimeRequest,
    EventListenerType,
    EventHandlerType,
    ControllerConstructorType,

    IController,
    IBackgroundCore
}
