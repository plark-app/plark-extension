import * as Declarations from './Declarations';
import {ExtensionProxy} from './ExtensionProxy';
import CreateProperties = chrome.tabs.CreateProperties;
import Manifest = chrome.runtime.Manifest;


class Platform {

    protected extension: ExtensionProxy;

    constructor() {
        this.extension = new ExtensionProxy();
    }

    getExtension(): ExtensionProxy {
        return this.extension;
    }

    /**
     * extract Runtime object function
     */
    getRuntime(): Declarations.RuntimeInterface {
        return this.getExtension().runtime;
    }

    /**
     * Extract Tabs function
     */
    getTabs(): Declarations.TabsInterface {
        return this.getExtension().tabs;
    }

    reload() {
        this.getRuntime().reload();
    }

    openWindow(createProperties: CreateProperties, callback: Function = null) {
        this.getExtension().tabs.create(createProperties, callback);
    }

    getManifest(): Manifest {
        return this.getRuntime().getManifest();
    }

    getNotifications(): any {
        return this.getExtension().notifications;
    }
}

export {
    Platform
}