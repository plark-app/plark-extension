import {Store} from 'redux';
import {Dictionary} from 'lodash';
import {IStore} from 'Core/Declarations/Store';
import {EventEmitter} from 'events';

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

interface IBackgroundCore extends EventEmitter {
    controllers: IController[];

    registerController<T extends IController>(c: ControllerConstructorType<T>): void;

    get(alias: string): IController;
}

export {
    ControllerConstructorType,
    IController,
    IBackgroundCore
}
