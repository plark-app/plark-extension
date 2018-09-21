import React from 'react';
import numeral from 'numeral';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { NavLink, Route, Switch, matchPath, withRouter } from 'react-router-dom';
import { Wallet } from '@berrywallet/core';

import { CoinIcon } from 'Popup/components/coin-icon';
import { mapWalletCoinToProps } from 'Popup/Store/wallet-coin-connector';

import { SeedScreenComponent } from './send-screen';
import { ReceiveScreenComponent } from './ReceiveScreen';
import { HistoryScreenComponent } from './history-screen';
import { WaitInitializingScreen } from './WaitInitializingScreen';


export const links = [{
    path: "/app/wallet",
    name: "Send",
}, {
    path: "/app/wallet/receive",
    name: "Receive",
}, {
    path: "/app/wallet/history",
    name: "History",
}];

export class CoinDashboardLayoutComponent extends React.PureComponent<any, any> {

    renderWalletTabs() {
        const { walletData, activeCoin } = this.props;

        if (!activeCoin || !walletData) {
            return <WaitInitializingScreen coin={activeCoin} />;
        }

        return (
            <Switch>
                <Route path="/app/wallet" exact={true} component={SeedScreenComponent} />
                <Route path="/app/wallet/receive" component={ReceiveScreenComponent} />
                <Route path="/app/wallet/history" component={HistoryScreenComponent} />
            </Switch>
        );
    };

    render() {

        const { activeCoin = null } = this.props;

        if (!activeCoin) {
            return <div className="dashboard-main -loading">Initializing wallet...</div>;
        }

        const { balance = null, ticker, fiat } = this.props;
        const totalBalance = balance ? Wallet.calculateBalance(balance, true) : 0;

        return (
            <div className="dashboard-content">
                <div className="dashboard-content-wrapper">
                    <div className="dashboard-head">

                        <div className="dashboard-head-info">
                            <CoinIcon
                                coin={activeCoin.getKey()}
                                className="dashboard-head-info__coin"
                                size={40}
                            />
                            <div className="dashboard-head-info__price">
                                <div className="dashboard-head-info__price-coin">
                                    <span className="dashboard-head-info__price-coin-value">
                                        {numeral(totalBalance).format('0,0.00[000000]')}
                                    </span>
                                    <span>{activeCoin.getKey()}</span>
                                </div>

                                <div className="dashboard-head-info__price-fiat">
                                    <span>{fiat.prefix}</span>
                                    <span className="dashboard-head-info__price-fiat-value">
                                        {numeral(totalBalance * ticker.priceFiat).format(fiat.format)}
                                    </span>
                                    <span>{fiat.key}</span>
                                </div>
                            </div>
                        </div>

                        <nav className="dashboard-head-nav">
                            {links.map((lnk, indx) => {
                                return <NavLink
                                    to={lnk.path}
                                    key={indx}
                                    exact={true}
                                    className="dashboard-head-nav__tab"
                                    activeClassName="-active"
                                >{lnk.name}</NavLink>;
                            })}

                            {this.renderSvgBackground()}
                        </nav>
                    </div>
                    <div className="dashboard-page">{this.renderWalletTabs()}</div>
                </div>
            </div>
        );
    }

    protected renderSvgBackground(): JSX.Element {
        const { location } = this.props;

        const activeIndex = links.findIndex((link): boolean => {
            return !!matchPath(location.pathname, {
                path: link.path,
                exact: true,
            });
        });

        const svgMaskProps = {
            className: "menu-background__hole",
            width: "70px",
            height: "6px",
            fill: "black",
            x: (100 * activeIndex + 15) + 'px',
            y: "27px",
            rx: "3px",
            ry: "3px",
        };

        return (
            <svg className="menu-background" style={{ borderRadius: '0 0 3px 3px' }}>
                <rect height="30px" width="100%" mask="url(#horizontal-menu-hole)" fill="white" />
                <mask id="horizontal-menu-hole">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <rect {...svgMaskProps} />
                </mask>
            </svg>
        );
    };
}

export const CoinDashboardLayout = compose<any, any>(
    withRouter,
    connect(mapWalletCoinToProps)
)(CoinDashboardLayoutComponent);
