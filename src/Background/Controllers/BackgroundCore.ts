import {Dictionary, merge, find} from 'lodash';
import Extberry from 'extberry';
import {Store} from 'redux';
import {createDebugger} from 'Core';
import {IStore} from 'Core/Declarations/Store';
import {EventEmitter} from 'events';

import {
    EventListenerType,
    EventHandlerType,
    IRuntimeRequest,
    IController,
    IBackgroundCore,
    ControllerConstructorType
} from 'Core/Declarations/Service';

const debug = createDebugger('BACKGROUND_EVENT');


export class BackgroundCore extends EventEmitter implements IBackgroundCore {
    store: Store<IStore>;
    controllers: IController[] = [];
    eventHandlers: Dictionary<EventHandlerType> = {} as Dictionary<EventHandlerType>;

    /**
     * @param {Store<IStore>} store
     */
    constructor(store: Store<IStore>) {
        super();

        this.store = store;
        Extberry.runtime.onMessage.addListener(this.generateEventListener());
    }

    /**
     * @param {ControllerConstructorType<T extends IController>} controller
     */
    registerController<T extends IController>(controller: ControllerConstructorType<T>) {
        const newController: T = new controller(this, this.store);
        this.controllers.push(newController);

        this.eventHandlers = merge(this.eventHandlers, newController.getEventListeners());
    }

    /**
     * @param {string} alias
     * @returns {IController}
     */
    get(alias: string): IController {
        const controller: IController = find(this.controllers, {alias: alias}) as IController;

        if (!controller) {
            throw Error(`Service '${alias}' has not registered!`);
        }

        return controller;
    }

    /**
     * @returns {EventListenerType}
     */
    generateEventListener(): EventListenerType {
        return (request: IRuntimeRequest, sender: any, sendResponse): boolean => {
            const eventHandler: EventHandlerType = this.eventHandlers[request.type];

            debug(request.type, request.payload);

            if (!eventHandler) {
                return;
            }

            const onError = (error: Error) => {
                sendResponse({
                    error: {
                        message: error.message,
                        code: "code" in error ? error['code'] : undefined,
                        name: error.name,
                        stack: error.stack
                    }
                });
            };

            try {
                const onSuccess = (data) => {
                    sendResponse({data: data});
                };

                const response = eventHandler(request.payload, sender);
                if (response instanceof Promise) {
                    response.then(onSuccess, onError).catch(onError);
                } else {
                    onSuccess(response);
                }
            } catch (error) {
                onError(error);
            }

            /**
             * SERIOUSLY??????????
             * I HAVE TO RETURN THIS FUCKED VALUE TO SAY: That I have many async responses???
             */
            return true;
        };
    }
}
