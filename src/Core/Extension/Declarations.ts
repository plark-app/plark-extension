declare global {
    export interface Window {
        browser: any
    }
}

declare type SendMessageEvent = (request: any, responseCallback?: (response: any) => void) => void;

interface RuntimeInterface {
    onMessage: chrome.runtime.ExtensionMessageEvent;
    sendMessage: SendMessageEvent;
    onInstalled: chrome.runtime.ExtensionMessageEvent;

    /**
     * Create port and connect it
     *
     * @param {chrome.runtime.ConnectInfo} connectInfo
     * @returns {chrome.runtime.Port}
     */
    connect(connectInfo?: chrome.runtime.ConnectInfo): chrome.runtime.Port;

    /**
     * Returning current extension manifest
     *
     * @returns {any}
     */
    getManifest(): chrome.runtime.Manifest;

    tabs: TabsInterface;

    reload(): void;
}

interface TabsInterface {
    create(props?: chrome.tabs.CreateProperties): void;
}

interface ExtensionInterface {
    alarms?: any;
    bookmarks?: any;
    browserAction?: any;
    commands?: any;
    contextMenus?: any;
    cookies?: any;
    downloads?: any;
    events?: any;
    extension?: any;
    extensionTypes?: string[];
    history?: any;
    i18n?: any;
    idle?: any;
    notifications?: any;
    pageAction?: any;
    runtime?: RuntimeInterface | any;
    storage?: any;
    tabs?: TabsInterface;
    webNavigation?: any;
    webRequest?: any;
    windows?: any;
    api?: any;

    initBaseApi(): void;
}


export {
    SendMessageEvent,
    RuntimeInterface,
    ExtensionInterface,
    TabsInterface
}