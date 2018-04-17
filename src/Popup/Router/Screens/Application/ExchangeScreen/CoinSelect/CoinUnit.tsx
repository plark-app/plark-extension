import React from 'react';
import {connect} from 'react-redux';
import Numeral from 'numeral';
import classNames from 'classnames';
import ReactSVG from 'react-svg';
import {Coins} from "Core";
import {IStore} from "Core/Declarations/Store";
import {Selector} from 'Popup/Store';

interface OwnProps {
    coin: Coins.CoinInterface;
    onClick?: (...props: any[]) => any;
}

interface StoreProps {
    balance: number;
    ticker: Coins.TickerInterface;
    fiat: Coins.FiatInterface;
}

export type IUnitProps = OwnProps & StoreProps;

class CoinUnit extends React.Component<IUnitProps, any> {
    render() {
        const {coin, onClick, balance, ticker, fiat} = this.props;

        return <div className="coin-unit">
            <ReactSVG
                path={`/images/coins/${coin.getKey()}.svg`}
                className={classNames("coin-unit__icon", `-${coin.getKey()}`)}
                wrapperClassName="coin-unit__icon-wrapper"
                style={{width: 20, height: 20}}
            />

            <div className="coin-unit-title">
                <div className={classNames("coin-unit__name", `text-${coin.getKey()}`)}>{coin.getName()}</div>
                <div className="coin-unit__value">
                    <span className="coin-unit__value-coin">
                        {Numeral(balance).format('0,0.00[00]')} {coin.getKey()}
                    </span> {' '}
                    <span className="coin-unit__value-fiat">
                        ({Numeral(balance * ticker.priceFiat).format('0,0.[00]')} {fiat.key})
                    </span>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (store: IStore, ownProps: OwnProps): StoreProps => {
    const coinKey = ownProps.coin.getKey();

    return {
        balance: Selector.walletBalanceSelector(store)(coinKey),
        ticker: Selector.tickerSelector(store)(coinKey),
        fiat: Selector.currentFiatSelector(store)
    };
};

export const CoinUnitComponent = connect(mapStateToProps)(CoinUnit);