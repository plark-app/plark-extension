import {ExtensionProxy} from './extension-proxy';
import CreateProperties = chrome.tabs.CreateProperties;

export class Platform {

    protected __extension: ExtensionProxy;

    constructor() {
        this.__extension = new ExtensionProxy();
    }

    getExtension(): ExtensionProxy {
        return this.__extension;
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

    get notifications(): typeof chrome.notifications {
        return this.getExtension().notifications;
    }

    get manifest(): chrome.runtime.Manifest {
        return this.getRuntime().getManifest();
    }

    get version(): string {
        return this.manifest.version;
    }
}
