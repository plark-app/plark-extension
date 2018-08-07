import React from 'react';
import { connect } from 'react-redux';
import { Dictionary } from 'lodash';
import { Coins } from 'Core';
import { IStore } from 'Core/Declarations/Store';
import { Selector } from 'Popup/Store';
import { CoinDashboardLayout } from './CoinDashboard';
import { WalletsNavigation } from './wallets-navigation';

export const WalletScreen = (props: WalletScreenProps) => (
    <div className="dashboard">
        <WalletsNavigation
            activeCoin={props.coin}
            coinList={props.coinList}
            mindAddNew={props.mindAddNew}
        />

        <CoinDashboardLayout activeCoin={props.coin} />
    </div>
);

type StoreProps = {
    coin: Coins.CoinInterface;
    coinList: Dictionary<Coins.CoinInterface>;
    mindAddNew: boolean;
};

type WalletScreenProps = StoreProps;

const mapStateToProps = (store: IStore): StoreProps => {
    const { Coin } = store;

    return {
        coin: Selector.currentCoinSelector(store),
        coinList: Coins.filterCoinList(Coin.coins),
        mindAddNew: Object.keys(Coins.coinList).length > Coin.coins.length,
    };
};

export const WalletScreenComponent = connect(mapStateToProps)(WalletScreen);
