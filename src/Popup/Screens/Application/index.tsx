import React from 'react';
import {each} from 'lodash';
import {connect} from 'react-redux';
import {Route, Switch, Link} from 'react-router-dom';
import cn from 'classnames';
import numeral from 'numeral';
import {Wallet} from '@berrywallet/core';
import {MenuLayout} from 'Popup/UI/Layouts';
import {extractTicker} from "Popup/Store/Helpers";
import {IStore} from "Core/Declarations/Store";
import {FiatInterface, filterCoinList, findFiat} from "Core/Coins";

import {WalletScreenComponent} from './WalletScreen';
import {ExchangeRouterComponent} from './ExchangeScreen';
import {OptionsScreen} from './OptionsScreen';
import {HelpScreen} from './HelpScreen';
import {PasscodeWrapper} from './NeedPasswordScreen';

const links = [{
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
}];

interface TApplicationOwnProps {
}

interface TApplicationStoreProps {
    needPassword: boolean;
    fiat: FiatInterface;
    balance: {
        bitcoin: number;
        fiat: number;
    };
}

type TApplicationProps = TApplicationOwnProps & TApplicationStoreProps;
type TApplicationState = {
    render: boolean;
};

export class ApplicationRootScreenComponent extends React.Component<TApplicationProps, TApplicationState> {
    public state: TApplicationState = {
        render: false
    };

    public render(): JSX.Element {
        const {needPassword = false, balance, fiat} = this.props;

        return (
            <div className="wallet">
                <div className={cn("wallet-application-content", {'-blured': needPassword})}>
                    <div className="wallet-sidebar">
                        <div className="wallet-sidebar-head">
                            <Link to="/app/wallet">
                                <img src="/images/logo.svg" className="wallet-sidebar-head__logo"/>
                            </Link>
                            <div className="wallet-sidebar-head__bitcoin">
                                <span>{numeral(balance.bitcoin).format("0,0.00[000000]")}</span>
                                <span className='wallet-sidebar-head__bitcoin-postfix'>BTC</span>
                            </div>
                            <div className="wallet-sidebar-head__currency">
                                <span className='wallet-sidebar-head__currency-prefix'>{fiat.prefix}</span>
                                <span>{numeral(balance.fiat).format(fiat.format)}</span>
                                <span className='wallet-sidebar-head__currency-postfix'>{fiat.key}</span>
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

                    <div className="wallet-main">
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

const mapStateToProps = (store: IStore) => {
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


export const ApplicationRootScreen = connect(mapStateToProps)(ApplicationRootScreenComponent);