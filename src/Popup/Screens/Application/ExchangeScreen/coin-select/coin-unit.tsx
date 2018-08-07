import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Numeral from 'numeral';
import classNames from 'classnames';
import { Coins } from 'Core';
import { CoinIcon } from 'Popup/UI';
import { IStore } from 'Core/Declarations/Store';
import { Selector } from 'Popup/Store';
import { withCurrentFiat, WithCurrentFiatProps } from 'Popup/contexts/current-fiat';

interface IOwnProps {
    coin: Coins.CoinInterface;
    onClick?: (...props: any[]) => any;
}

interface IStoreProps {
    balance: number;
}

export type TUnitProps = IOwnProps & IStoreProps & WithCurrentFiatProps;

const CoinUnitComponent = (props: TUnitProps) => {
    const { coin, balance, currentFiat } = props;

    const ticker = currentFiat.getTicker(coin.getKey());

    return (
        <div className="coin-unit">
            <CoinIcon coin={coin.getKey()} className="coin-unit__icon" size={20} />
            <div className="coin-unit-title">
                <div className={classNames("coin-unit__name", `text-${coin.getKey()}`)}>{coin.getName()}</div>
                <div className="coin-unit__value">
                        <span className="coin-unit__value-coin">
                            {Numeral(balance).format('0,0.00[00]')} {coin.getKey()}
                        </span>
                    {' '}
                    <span className="coin-unit__value-fiat">
                            ({Numeral(balance * ticker.priceFiat).format('0,0.[00]')} {currentFiat.fiat.key})
                        </span>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (store: IStore, ownProps: IOwnProps): IStoreProps => {
    const coinKey = ownProps.coin.getKey();
    
    return {
        balance: Selector.walletBalanceSelector(store)(coinKey),
    };
};

export const CoinUnit = compose<TUnitProps, IOwnProps>(
    withCurrentFiat,
    connect(mapStateToProps),
)(CoinUnitComponent);
