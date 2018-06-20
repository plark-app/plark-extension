import React from 'react';
import {connect} from 'react-redux';
import Numeral from 'numeral';
import classNames from 'classnames';
import {Coins} from 'Core';
import {CoinIcon} from 'Popup/UI';
import {IStore} from 'Core/Declarations/Store';
import {Selector} from 'Popup/Store';

interface IOwnProps {
    coin: Coins.CoinInterface;
    onClick?: (...props: any[]) => any;
}

interface IStoreProps {
    balance: number;
    ticker: Coins.TickerInterface;
    fiat: Coins.FiatInterface;
}

export type TUnitProps = IOwnProps & IStoreProps;

class CoinUnit extends React.Component<TUnitProps, any> {
    public render(): JSX.Element {
        const {coin, balance, ticker, fiat} = this.props;

        return (
            <div className="coin-unit">
                <CoinIcon coin={coin.getKey()} className="coin-unit__icon" size={20}/>
                <div className="coin-unit-title">
                    <div className={classNames("coin-unit__name", `text-${coin.getKey()}`)}>{coin.getName()}</div>
                    <div className="coin-unit__value">
                        <span className="coin-unit__value-coin">
                            {Numeral(balance).format('0,0.00[00]')} {coin.getKey()}
                        </span>
                        {' '}
                        <span className="coin-unit__value-fiat">
                            ({Numeral(balance * ticker.priceFiat).format('0,0.[00]')} {fiat.key})
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store: IStore, ownProps: IOwnProps): IStoreProps => {
    const coinKey = ownProps.coin.getKey();

    return {
        balance: Selector.walletBalanceSelector(store)(coinKey),
        ticker: Selector.tickerSelector(store)(coinKey),
        fiat: Selector.currentFiatSelector(store)
    };
};

export const CoinUnitComponent = connect(mapStateToProps)(CoinUnit);