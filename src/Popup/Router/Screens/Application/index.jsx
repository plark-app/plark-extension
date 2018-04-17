import React from 'react';
import {Wallet} from '@berrywallet/core';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import classNames from 'classnames';
import numeral from 'numeral';
import {each} from 'lodash';

import {MenuLayout} from 'Popup/UI/Layouts';
import {extractTicker} from "Popup/Store/Helpers";
import {filterCoinList, findFiat} from "Core/Coins";

import {WalletScreenComponent} from './WalletScreen';
import {ExchangeRouterComponent} from './ExchangeScreen';
import OptionsScreen from './OptionsScreen';
import HelpScreen from './HelpScreen';
import PasscodeWrapper from './NeedPasswordScreen';

const links = [
    {
        path: '/app/wallet',
        name: 'Wallets'
    }, {
        path: '/app/exchange',
        name: 'Exchange'
    }, {
        path: '/app/options',
        name: 'Options'
    }, {
        path: '/app/help',
        name: 'Help'
    }
];

const mapStateToProps = (store) => {
    const coins = filterCoinList(store.Coin.coins);
    const balance = {
        bitcoin: 0,
        fiat: 0
    };

    each(coins, (coin) => {
        const wallet = store.Wallet[coin.getKey()];
        const ticker = extractTicker(coin.getKey());

        if (wallet.walletData) {
            const pwProvider = new Wallet.Provider.WDProvider(wallet.walletData);
            const coinBalance = Wallet.Helper.calculateBalance(pwProvider.balance, true);

            balance.bitcoin += coinBalance * ticker.priceBtc;
            balance.fiat += coinBalance * ticker.priceFiat;
        }
    });

    return {
        needPassword: store.Keyring.needPassword,
        balance: balance,
        fiat: findFiat(store.Coin.currentFiatKey)
    }
};

@connect(mapStateToProps)
export default class ApplicationScreen extends React.Component {

    state = {
        render: false
    };

    render() {
        const {needPassword = false} = this.props;

        return (
            <div className="wallet">
                <div className={classNames("wallet-application-content", {'-blured': needPassword})}>
                    <div className="wallet-sidebar">
                        <div className="wallet-sidebar-head">
                            <img src="/images/logo.svg" className="wallet-sidebar-head__logo"/>
                            <div className="wallet-sidebar-head__bitcoin">
                                <span>{numeral(this.props.balance.bitcoin).format("0,0.00[000000]")}</span>
                                <span className='wallet-sidebar-head__bitcoin-postfix'>BTC</span>
                            </div>
                            <div className="wallet-sidebar-head__currency">
                                <span className='wallet-sidebar-head__currency-prefix'>{this.props.fiat.prefix}</span>
                                <span>{numeral(this.props.balance.fiat).format(this.props.fiat.format)}</span>
                                <span className='wallet-sidebar-head__currency-postfix'>{this.props.fiat.key}</span>
                            </div>
                        </div>
                        <MenuLayout
                            links={links}
                            maskKey="main"
                            isSmall={false}
                            containerClassName="wallet-sidebar-nav"
                            itemClassName="wallet-sidebar-nav__item"
                            svgStyle={{borderRadius: "0 0 3px 3px"}}
                        />
                    </div>

                    <div className={classNames("wallet-main")}>
                        <Switch>
                            <Route path='/app/wallet' component={WalletScreenComponent}/>
                            <Route path='/app/exchange' component={ExchangeRouterComponent}/>
                            <Route path='/app/options' component={OptionsScreen}/>
                            <Route path='/app/help' component={HelpScreen}/>
                        </Switch>
                    </div>
                </div>

                <PasscodeWrapper open={needPassword}/>
            </div>
        )
    }
}
