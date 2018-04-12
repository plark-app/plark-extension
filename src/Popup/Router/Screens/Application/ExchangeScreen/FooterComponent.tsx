import React from 'react';
import {Coins} from 'Core';
import {Units} from 'BeShapy';

interface IFooterOwnProps {
    fromCoin: Coins.CoinInterface;
    toCoin: Coins.CoinInterface;

    marketInfo?: Units.MarketInfo;
}

export class FooterComponent extends React.Component<IFooterOwnProps, any> {
    render() {

        const {fromCoin, toCoin, marketInfo} = this.props;

        return (
            <div className="exchange-footer">
                <div className="exchange-footer-side">
                    <div>Minimum: {marketInfo ? marketInfo.minimum : '-'}</div>
                    <div>Limit: {marketInfo ? marketInfo.limit : '-'}</div>
                </div>
                <div className="exchange-footer-side -right">
                    <div>Powered by SHAPESHIFT</div>
                    <div>1 {fromCoin.getKey()} = {marketInfo ? marketInfo.rate : '-'} {toCoin.getKey()}</div>
                </div>
            </div>
        )
    }
}