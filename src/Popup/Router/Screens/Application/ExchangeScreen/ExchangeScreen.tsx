import React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import screenHistory from 'Popup/ScreenAddressHistory';
import {map} from 'lodash';

import {IStore} from "Core/Declarations/Store";
import {Coins} from 'Core';
import {extractTicker} from 'Popup/Store/Helpers';
import {Button} from "Popup/UI";
import {TrackScreenLayout} from 'Popup/UI/Layouts';

export interface ExchangeMountedProps {
    fromCoin: Coins.CoinInterface;
    fromTicker: Coins.TickerInterface;

    toCoin: Coins.CoinInterface;
    toTicker: Coins.TickerInterface;
}

export interface ExchangeUrlParams {
    fromCoin: Coins.CoinSymbol;
    toCoin: Coins.CoinSymbol;
}

export type IExchangeProps = RouteComponentProps<ExchangeUrlParams> & ExchangeMountedProps;

class ExchangeScreen extends React.Component<IExchangeProps, any> {

    onChangeCoin = (cn: Coins.CoinInterface, isFrom: boolean) => {
        const {fromCoin, toCoin} = this.props;

        return () => {
            let newFrom = fromCoin;
            let newTo = toCoin;

            if ((isFrom && cn == newTo) || (!isFrom && cn == newFrom)) {
                newFrom = toCoin;
                newTo = fromCoin;
            } else {
                if (isFrom) {
                    newFrom = cn;
                } else {
                    newTo = cn;
                }
            }

            screenHistory.push(`/app/exchange/${newFrom.getKey()}/${newTo.getKey()}`);
        }
    };

    renderCoinList = (coin: Coins.CoinInterface, isFrom: boolean) => {
        return map(Coins.getRealCoins(), (cn: Coins.CoinInterface) => {
            return (
                <div key={cn.getKey()}>
                    <button onClick={this.onChangeCoin(cn, isFrom)}>
                        {cn.getName()} {cn.getKey() === coin.getKey() && ' + '}
                    </button>
                </div>
            );
        })
    };

    render() {
        const {fromCoin, toCoin} = this.props;
        const trackLabel = `exchange-${fromCoin.getKey()}-${toCoin.getKey()}`;

        return <TrackScreenLayout className="exchange" trackLabel={trackLabel}>
            <div className="exchange-sides">
                <div className="exchange-side">
                    <h2>EXCHANGE</h2>
                    {this.renderCoinList(fromCoin, true)}
                </div>
                <div className="exchange-side">
                    <h2>RECEIVE</h2>
                    {this.renderCoinList(toCoin, false)}
                </div>
            </div>

            <Button className="-full-size" disabled={true}>Exchange</Button>
        </TrackScreenLayout>
    }
}

const mapStateToProps = (store: IStore, ownProps: IExchangeProps): ExchangeMountedProps => {
    const {fromCoin, toCoin} = ownProps.match.params;

    const fromCoinItem = Coins.findCoin(fromCoin);
    const toCoinItem = Coins.findCoin(toCoin);

    if (!fromCoinItem || !toCoinItem) {
        screenHistory.push('/app/wallet');

        return null;
    }

    return {
        fromCoin: fromCoinItem,
        toCoin: toCoinItem,
        fromTicker: extractTicker(fromCoinItem.getKey()),
        toTicker: extractTicker(toCoinItem.getKey()),
    };
};

export const ExchangeScreenComponent = connect(mapStateToProps)(ExchangeScreen);