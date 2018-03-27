import * as Declarations from './Declarations';
import {ExtensionProxy} from './ExtensionProxy';
import CreateProperties = chrome.tabs.CreateProperties;

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
    getRuntime(): typeof chrome.runtime {
        return this.getExtension().runtime;
    }

    /**
     * Extract Tabs function
     */
    getTabs(): typeof chrome.tabs {
        return this.getExtension().tabs;
    }

    reload(): void {
        this.getRuntime().reload();
    }

    openWindow(createProperties: CreateProperties, callback: (tab: chrome.tabs.Tab) => any = null) {
        this.getExtension().tabs.create(createProperties, callback);
    }

    getManifest(): chrome.runtime.Manifest {
        return this.getRuntime().getManifest();
    }

    getNotifications(): typeof chrome.notifications {
        return this.getExtension().notifications;
    }
}

export {
    Platform
}