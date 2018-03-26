import {extensionInstance} from 'Core/Extension';

const UniversalAnalytics = require('universal-analytics');
const uuidv4 = require('uuid/v4');
const localStorage = require('local-storage');

const USER_UUID_KEY = 'USER_UUID';

const AnalyticsOptions = {
    GA_IDENTIFY: 'UA-116441094-1',
    NAME: 'BERRYWALLET',
    VERSION: extensionInstance.getManifest().version
};

let visitorUUID = localStorage.get(USER_UUID_KEY);

if (!visitorUUID) {
    visitorUUID = uuidv4();
    localStorage.set(USER_UUID_KEY, visitorUUID);
}

const visitor = UniversalAnalytics(AnalyticsOptions.GA_IDENTIFY, visitorUUID, {https: true});

class AnalyticsObserver {
    static screenview(title: string) {
        visitor
            .screenview(title, AnalyticsOptions.NAME, AnalyticsOptions.VERSION)
            .send();
    }

    static event(category: string, action: string, label?: string, value?: string | number) {
        const params = {
            ec: category,
            ea: action,
            el: label,
            ev: value
        };

        visitor.event(params).send()
    }

    static exception(exception: Error, isFatal: boolean = false) {
        visitor.exception(exception.message, isFatal).send()
    }
}

export {
    AnalyticsOptions,
    visitor,
    AnalyticsObserver
}