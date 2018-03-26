import * as Declarations from './Declarations';
import {ExtensionProxy} from "./ExtensionProxy";
import {Platform} from './Platform';

const extensionInstance: Platform = new Platform();

export {
    Declarations,
    Platform,
    ExtensionProxy,

    extensionInstance
}