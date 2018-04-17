export {IExtension, SendMessageEvent} from './declarations';
export {ExtensionProxy} from "./extension-proxy";
import {Platform} from './platform';

const extensionInstance: Platform = new Platform();

export {
    Platform,
    extensionInstance
}