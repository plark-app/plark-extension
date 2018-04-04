import {Dictionary} from 'lodash';
import {SHAPESHIFT_URL, SHAPESHIFT_DEFAULT_API_KEY} from './constants';
import {pair} from './utils';
import Axios, {AxiosResponse, AxiosRequestConfig, AxiosInstance} from 'axios';
import {
    LimitResponse,
    RateResponse,
    MarketInfo,
    TxStatus,
    RecentTx,
    CoinInfo
} from "./response";

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

    getRate(from: string, to: string): Promise<RateResponse> {
        return this.sendRequest<RateResponse>('/rate/' + pair(from, to));
    }

    getLimit(from: string, to: string): Promise<LimitResponse> {
        return this.sendRequest<LimitResponse>('/limit/' + pair(from, to));
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

    shift(from: string, to: string, toAddress: string, returnAddress?: string): Promise<any> {
        return this.sendRequest<any>('/shift', {
            withdrawal: toAddress,
            pair: pair(from, to),
            returnAddress: returnAddress,
            apiKey: this.apiKey
        });
    }
}
