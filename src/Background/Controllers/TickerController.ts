import {Store} from 'redux';
import {each, find, Dictionary} from 'lodash';
import createClient, {IBerryMarketCap} from 'berrymarketcap';
import {EventHandlerType, IBackgroundCore} from 'Core/Declarations/Service';
import {AbstractController} from "Background/Service/AbstractController";
import {IStore} from 'Core/Declarations/Store';
import {CoinAction} from 'Core/Actions/Reducer';
import {coinList, CoinInterface, TickerInterface, FiatSymbol} from 'Core/Coins';
import {TickerEvent} from "Core/Actions/Controller";

const tickerTimeout = 5 * 60 * 1000;

interface CoinTickerInterface {
    price_btc: string;
}

export default class TickerController extends AbstractController {

    tickerObserverTimeout;
    coinMarkerCapClient: IBerryMarketCap;

    constructor(app: IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.coinMarkerCapClient = createClient({timeout: 10000});

        this.extractTickers();
        this.tickerObserverTimeout = setInterval(this.extractTickers.bind(this), tickerTimeout);

        this.bindEventListener(TickerEvent.ChangeCurrentFiat, this.changeCurrentFiat);
    }

    static getAlias(): string {
        return 'TICKER';
    }

    protected extractTickers() {
        const {currentFiatKey = FiatSymbol.USDollar} = this.getState().Coin;
        const requestOptions = {convert: currentFiatKey.toUpperCase()};

        const onSuccess = (data) => {
            const payloadTickers: TickerInterface[] = [];

            each(coinList, (coin: CoinInterface) => {
                const coinTicker: CoinTickerInterface = find(data, ((tick) => tick.symbol === coin.getKey()) as any);
                if (!coinTicker) return;

                payloadTickers.push({
                    key: coin.getKey(),
                    priceBtc: parseFloat(coinTicker.price_btc),
                    priceFiat: parseFloat(coinTicker[`price_${currentFiatKey.toLowerCase()}`])
                } as TickerInterface);
            });

            this.dispatchStore(CoinAction.SetTickers, {
                tickers: payloadTickers
            });
        };

        this.coinMarkerCapClient
            .getTickers(requestOptions)
            .then(onSuccess);
    }

    /**
     * Action
     *
     * @param request
     * @returns {any}
     */
    changeCurrentFiat: EventHandlerType = (request: any): any => {
        this.dispatchStore(CoinAction.SetCurrentFiat, {
            fiatKey: request.fiat
        });

        this.extractTickers();
    };
}