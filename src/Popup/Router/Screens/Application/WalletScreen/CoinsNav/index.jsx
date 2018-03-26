import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {map} from 'lodash';

import {CoinSymbol} from 'Core/Coins';

import ReactSVG from 'react-svg';
import CoinItem from './CoinItem';

export default class CoinsNav extends React.Component {
    state = {
        loaded: false
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState(() => {
                return {loaded: true};
            });
        }, 0);
    };

    drawCoins = () => {
        const {coinList, activeCoin} = this.props;

        return map(coinList, (coin) => {
            return <CoinItem
                key={coin.getKey()}
                coin={coin}
                isActive={activeCoin && activeCoin.getKey() === coin.getKey()}
            />
        })
    };

    drawAddCoin = () => {
        return (
            <Link className="dashboard-add-coin" to="/app/options">
                <ReactSVG path="/images/coin-layout-bg.svg"
                          className="dashboard-add-coin-background"
                          wrapperClassName="dashboard-add-coin-background__wrapper"/>
                <img src="/images/icons/add.svg" className="dashboard-add-coin__icon"/>
                <div className="dashboard-add-coin__label">Add New Wallet</div>
            </Link>
        )
    };

    drawComingSoon = () => {
        const coinsToRender = [
            CoinSymbol.BitcoinCash,
            CoinSymbol.Ripple,
            CoinSymbol.Neo,
            CoinSymbol.Monero
        ];

        return (
            <div className="coming-soon">
                <div className="coming-soon__currencies">
                    {map(coinsToRender, (coin) => (
                        <ReactSVG key={coin}
                                  path={`/images/coins/${coin}.svg`}
                                  className="coming-soon__currencies-item"
                                  wrapperClassName="coming-soon__currencies-item-wrapper"/>
                    ))}
                </div>
                <div className="coming-soon__label">New currencies coming soon!</div>
            </div>
        )
    };

    render() {
        return (
            <div className="dashboard-coins">
                <div className={classNames("dashboard-coins__wrapper", {'-loaded': this.state.loaded})}>
                    <div className="dashboard-coins__container">
                        {this.drawCoins()}
                        {this.props.mindAddNew ? this.drawAddCoin() : null}
                        {this.drawComingSoon()}
                    </div>
                </div>
            </div>
        )
    }
}
