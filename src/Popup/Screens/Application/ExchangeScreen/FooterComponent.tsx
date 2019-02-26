import React from 'react';
import { Coins } from 'Core';
import { BeShapyUnits } from 'be-shapy';

type FooterOwnProps = {
    fromCoin: Coins.CoinInterface;
    toCoin: Coins.CoinInterface;

    marketInfo?: BeShapyUnits.MarketInfo;
};

export class FooterComponent extends React.PureComponent<FooterOwnProps> {
    public render(): JSX.Element {

        const { fromCoin, toCoin, marketInfo } = this.props;

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
        );
    }
}
