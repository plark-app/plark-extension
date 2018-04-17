import React from 'react';
import {connect} from 'react-redux';
import {Dictionary} from 'lodash';

import {Coins} from 'Core';
import {IStore} from 'Core/Declarations/Store';
import {Selector} from 'Popup/Store';

import {CoinDashboardLayout} from "./CoinDashboard";
import {CoinsNav} from "./CoinsNav";


export interface IWalletScreenOwnProps {
}

interface IWalletScreenProps {
    coin: Coins.CoinInterface;
    coinList: Dictionary<Coins.CoinInterface>;
    mindAddNew: boolean;
}

export class WalletScreen extends React.Component<IWalletScreenOwnProps & IWalletScreenProps, any> {
    render() {
        return (
            <div className="dashboard">
                <CoinsNav
                    activeCoin={this.props.coin}
                    coinList={this.props.coinList}
                    mindAddNew={this.props.mindAddNew}
                />

                <CoinDashboardLayout activeCoin={this.props.coin}/>
            </div>
        );
    }
}

const mapStateToProps = (store: IStore): IWalletScreenProps => {
    const {Coin} = store;

    return {
        coin: Selector.currentCoinSelector(store),
        coinList: Coins.filterCoinList(Coin.coins),
        mindAddNew: Object.keys(Coins.coinList).length > Coin.coins.length
    };
};


export const WalletScreenComponent = connect(mapStateToProps)(WalletScreen);