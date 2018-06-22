import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import numeral from 'numeral';
import ReactSVG from 'react-svg';

import {Wallet} from "@berrywallet/core";
import {CoinIcon} from "Popup/UI";
import {findFiat} from "Core/Coins";
import proxyStore from 'Popup/Store';
import {extractTicker} from "Popup/Store/Helpers";
import {CoinAction} from "Core/Actions/Reducer";
import {Analytics} from "Popup/Service";

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
export class WalletItem extends React.Component {

    onChangeIt = () => {
        if (this.props.isActive) {
            return;
        }

        const coinKey = this.props.coin.key;

        proxyStore.dispatch({
            type: CoinAction.SetCurrentCoin,
            coinKey: coinKey
        });

        Analytics.event('WALLET', 'CHOOSE_WALLET', coinKey);
    };

    render() {
        const {coin, ticker, fiat, balanceAmount = 0} = this.props;

        const linkProps = {
            className: classNames("dashboard-coin", {"-active": this.props.isActive}),
            onClick: this.onChangeIt
        };

        return (<div {...linkProps}>
            <div style={{color: coin.getColor()}} className="dashboard-coin__head">
                <CoinIcon coin={coin.getKey()} size={20}/>
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
