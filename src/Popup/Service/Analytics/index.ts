import {createDebugger} from 'Core/Debugger';
import Extberry from 'extberry';

const UniversalAnalytics = require('universal-analytics');
const uuidv4 = require('uuid/v4');
const localStorage = require('local-storage');
const debugAnalytic = createDebugger('analytics');

const USER_UUID_KEY = 'USER_UUID';

let visitorUUID = localStorage.get(USER_UUID_KEY);

if (!visitorUUID) {
    visitorUUID = uuidv4();
    localStorage.set(USER_UUID_KEY, visitorUUID);
}

export const AnalyticsOptions = {
    GA_IDENTIFY: 'UA-116441094-1',
    NAME: 'BERRYWALLET',
    VERSION: Extberry.version
};

export const visitor = UniversalAnalytics(AnalyticsOptions.GA_IDENTIFY, visitorUUID, {https: true});

export function screenview(title: string) {
    visitor
        .screenview(title, AnalyticsOptions.NAME, AnalyticsOptions.VERSION)
        .send();

    debugAnalytic(`Screen view %c${title}`, 'color: blue;');
}

export function event(category: string, action: string, label?: string, value?: string | number) {
    const params = {
        eventCategory: category,
        eventAction: action,
        eventLabel: label,
        eventValue: value
    };

    visitor.event(params).send();
    debugAnalytic(`Event view %c${category}`, 'color: blue;', params);
}

export function exception(exception: Error, isFatal: boolean = false) {
    visitor.exception(exception.message, isFatal).send();

    debugAnalytic(`Track exception %c${exception.message}`, 'color: blue;');
}

export function trackExchange(txid: string, pair: string, income: number) {
    const transaction = {ti: txid, tr: income};
    const item = {ti: txid, 'in': pair, tr: income};

    debugAnalytic(`Track transaction with ID: ${txid}, Income: ${income}, Pair: ${pair}`);

    try {
        visitor
            .event({eventCategory: "Exchange", eventAction: "success", eventLabel: pair})
            .transaction(transaction)
            .item(item)
            .send();

    } catch (error) {
        debugAnalytic(`Error on Track Transaction! ${txid}`)
    }
}