import React from 'react';
import {connect} from 'react-redux';

import {filterCoinList, coinList, findCoin} from 'Core/Coins';

import CoinDashboard from "./CoinDashboard";
import CoinsNav from "./CoinsNav";

const mapStateToProps = (store) => {
    const {Coin} = store;

    return {
        coin: findCoin(Coin.currentCoinKey),
        coinList: filterCoinList(Coin.coins),
        mindAddNew: Object.keys(coinList).length > Coin.coins.length
    };
};

@connect(mapStateToProps)
export default class WalletScreen extends React.Component {
    render() {

        return (
            <div className="dashboard">
                <CoinsNav activeCoin={this.props.coin}
                          coinList={this.props.coinList}
                          mindAddNew={this.props.mindAddNew}/>

                <CoinDashboard activeCoin={this.props.coin}/>
            </div>
        );
    }
}
