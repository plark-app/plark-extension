import {Dictionary} from 'lodash';
import Axios, {AxiosResponse, AxiosRequestConfig, AxiosInstance} from 'axios';
import {SHAPESHIFT_URL, SHAPESHIFT_DEFAULT_API_KEY} from './constants';
import {pair} from './utils';
import {
    Limit,
    Rate,
    MarketInfo,
    TxStatus,
    RecentTx,
    CoinInfo, Shift
} from "./units";

export interface BeShapyRequestParams {
    url: string;
    data?: any;
}

export class BeShapyClient {
    apiKey?: string;
    apiSecret?: string;

    client: AxiosInstance;

    constructor(apiKey?: string, apiSecret?: string) {
        this.client = Axios.create({
            baseURL: SHAPESHIFT_URL
        });

        this.apiKey = apiKey || SHAPESHIFT_DEFAULT_API_KEY;
        this.apiSecret = apiSecret;
    }

    protected sendRequest<T>(url: string, postParams?: any): Promise<T> {
        const config: AxiosRequestConfig = {
            url: url,
            method: postParams ? 'POST' : 'GET',
            data: postParams ? postParams : null
        };

        return this.client.request(config).then((response: AxiosResponse) => {
            return response.data as T;
        });
    }

    getRate(from: string, to: string): Promise<Rate> {
        return this.sendRequest<Rate>('/rate/' + pair(from, to));
    }

    getLimit(from: string, to: string): Promise<Limit> {
        return this.sendRequest<Limit>('/limit/' + pair(from, to));
    }

    getInfo(from: string, to: string): Promise<MarketInfo> {
        return this.sendRequest<MarketInfo>('/marketinfo/' + pair(from, to));
    }

    getRecentTx(count: number = 1): Promise<RecentTx[]> {
        return this.sendRequest<RecentTx[]>('/recenttx/' + count);
    }

    getTxStat(address: string): Promise<TxStatus> {
        return this.sendRequest<TxStatus>('/txStat/' + address);
    }

    getCoins(): Promise<Dictionary<CoinInfo>> {
        return this.sendRequest<any>('/getcoins');
    }

    shift(from: string, to: string, toAddress: string, returnAddress?: string): Promise<Shift> {
        return this.sendRequest<any>('/shift', {
            pair: pair(from, to),
            withdrawal: toAddress,
            returnAddress: returnAddress,
            apiKey: this.apiKey
        });
    }
}
