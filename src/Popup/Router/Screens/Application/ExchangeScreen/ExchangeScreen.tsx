import React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import screenHistory from 'Popup/ScreenAddressHistory';
import {map} from 'lodash';

import {IStore} from "Core/Declarations/Store";
import {Coins} from 'Core';
import {TrackScreenLayout} from 'Popup/UI/Layouts';
import {extractTicker} from 'Popup/Store/Helpers';
import {Button} from "Popup/UI";
import {CoinSelect} from "./CoinSelect";


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

    render() {
        const {fromCoin, toCoin} = this.props;
        const trackLabel = `exchange-${fromCoin.getKey()}-${toCoin.getKey()}`;

        return <TrackScreenLayout className="exchange" trackLabel={trackLabel}>
            <div className="exchange-sides">
                <div className="exchange-side">
                    <h2 className="exchange-side__head">EXCHANGE</h2>
                    <CoinSelect fromCoin={fromCoin} toCoin={toCoin} isFrom={true}/>
                </div>
                <div className="exchange-side">
                    <h2 className="exchange-side__head">RECEIVE</h2>
                    <CoinSelect fromCoin={fromCoin} toCoin={toCoin} isFrom={false}/>
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