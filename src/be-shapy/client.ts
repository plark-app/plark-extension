import { Dictionary } from 'lodash';
import Axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { SHAPESHIFT_URL, SHAPESHIFT_DEFAULT_API_KEY } from './constants';
import { pair } from './utils';
import { Limit, Rate, MarketInfo, TxStatus, RecentTx, CoinInfo, Shift } from './units';

export interface BeShapyRequestParams {
    url: string;
    data?: any;
}

export class BeShapyClient {
    protected apiKey?: string;
    protected apiSecret?: string;

    protected client: AxiosInstance;

    public constructor(apiKey?: string, apiSecret?: string) {
        this.client = Axios.create({
            baseURL: SHAPESHIFT_URL,
            withCredentials: false,
        });

        this.apiKey = apiKey || SHAPESHIFT_DEFAULT_API_KEY;
        this.apiSecret = apiSecret;
    }

    protected async sendRequest<T>(url: string, postParams?: any): Promise<T> {
        const config: AxiosRequestConfig = {
            url: url,
            method: postParams ? 'POST' : 'GET',
            data: postParams ? postParams : null,
        };

        const { data } = await this.client.request(config);

        return data as T;
    }

    public async getRate(from: string, to: string): Promise<Rate> {
        return this.sendRequest<Rate>('/rate/' + pair(from, to));
    }

    public async getLimit(from: string, to: string): Promise<Limit> {
        return this.sendRequest<Limit>('/limit/' + pair(from, to));
    }

    public async getInfo(from: string, to: string): Promise<MarketInfo> {
        return this.sendRequest<MarketInfo>('/marketinfo/' + pair(from, to));
    }

    public async getRecentTx(count: number = 1): Promise<RecentTx[]> {
        return this.sendRequest<RecentTx[]>('/recenttx/' + count);
    }

    public async getTxStat(address: string): Promise<TxStatus> {
        return this.sendRequest<TxStatus>('/txStat/' + address);
    }

    public async getCoins(): Promise<Dictionary<CoinInfo>> {
        return this.sendRequest<any>('/getcoins');
    }

    public async shift(from: string, to: string, toAddress: string, returnAddress?: string): Promise<Shift> {
        return this.sendRequest<any>('/shift', {
            pair: pair(from, to),
            withdrawal: toAddress,
            returnAddress: returnAddress,
            apiKey: this.apiKey,
        });
    }
}
