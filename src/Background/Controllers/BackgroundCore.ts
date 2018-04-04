import {Dictionary, merge, find} from 'lodash';
import {Store} from 'redux';
import {IStore} from 'Core/Declarations/Store';
import {extensionInstance} from 'Core/Extension';

import {
    EventListenerType,
    EventHandlerType,
    IRuntimeRequest,
    IController,
    IBackgroundCore,
    ControllerConstructorType
} from 'Core/Declarations/Service';


export class BackgroundCore implements IBackgroundCore {
    store: Store<IStore>;
    controllers: IController[] = [];
    eventHandlers: Dictionary<EventHandlerType> = {} as Dictionary<EventHandlerType>;

    /**
     * @param {Store<IStore>} store
     */
    constructor(store: Store<IStore>) {
        this.store = store;
        extensionInstance.getRuntime().onMessage.addListener(this.generateEventListener());
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
            if (!eventHandler) {
                return;
            }

            const onError = (error) => {
                sendResponse({
                    error: {
                        message: error.message,
                        code: error.code || null
                    }
                });
            };

            try {
                const onSuccess = (data) => {
                    sendResponse({data: data});
                };

                const response = eventHandler(request.payload, sender);
                if (response instanceof Promise) {
                    response.then(onSuccess);
                } else {
                    onSuccess(response);
                }
            } catch (error) {
                onError(error);
            }

            /**
             * SERIOUSLY??????????
             * I HAVE TO RETURN THIS FUCKED VALUE TO SAY: that I have many async responses???
             */
            return true;
        };
    }
}
