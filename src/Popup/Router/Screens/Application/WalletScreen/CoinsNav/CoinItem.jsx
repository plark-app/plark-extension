import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import numeral from 'numeral';
import ReactSVG from 'react-svg';

import {findFiat} from "Core/Coins";
import proxyStore from 'Popup/Store';
import {extractTicker} from "Popup/Store/Helpers";
import {CoinAction} from "Core/Actions/Reducer";
import {AnalyticsObserver} from "Popup/Service/Analytics";
import {Wallet} from "@berrywallet/core";

@connect((store, ownProps) => {
    const {walletData = null} = store.Wallet[ownProps.coin.getKey()];
    let balanceAmount = 0;

    if (walletData) {
        const pwProvider = new Wallet.Provider.WDProvider(walletData);
        balanceAmount = Wallet.Helper.calculateBalance(pwProvider.balance, true);
    }

    return {
        ticker: extractTicker(ownProps.coin.getKey()),
        balanceAmount: balanceAmount,
        fiat: findFiat(store.Coin.currentFiatKey)
    }
})
export default class CoinItem extends React.Component {

    onChangeIt = () => {
        if (this.props.isActive) {
            return;
        }

        const coinKey = this.props.coin.key;

        proxyStore.dispatch({
            type: CoinAction.SetCurrentCoin,
            coinKey: coinKey
        });

        AnalyticsObserver.event('ChooseCoin', coinKey);
    };

    render() {
        const {coin, ticker, fiat, balanceAmount = 0} = this.props;

        const linkProps = {
            className: classNames("dashboard-coin", {"-active": this.props.isActive}),
            onClick: this.onChangeIt
        };

        return (<div {...linkProps}>
            <div style={{color: coin.getColor()}} className="dashboard-coin__head">
                <ReactSVG
                    path={`/images/coins/${coin.getKey()}.svg`}
                    className={classNames("coin-icon", `-${coin.getKey()}`)}
                    wrapperClassName="coin-icon-wrapper"
                    style={{width: 20, height: 20}}
                />
                <span className='dashboard-coin__head-alias'>{coin.getName()}</span>
            </div>

            <div className="dashboard-coin__info">
                <div className="dashboard-coin__info-balance">
                    <span>{numeral(balanceAmount).format('0,0.00[000000]')}</span> <span>{coin.getKey()}</span>
                </div>
                <div className="dashboard-coin__info-currency">
                    <span>{fiat.prefix ? fiat.prefix : fiat.key}</span>
                    <span>{numeral(balanceAmount * ticker.priceFiat).format('0,0.00')}</span>
                </div>
            </div>

            <ReactSVG
                path={`/images/coin-layout-bg.svg`}
                className="dashboard-coin-background"
                wrapperClassName="dashboard-coin-background__wrapper"
            />

        </div>);
    }
}
