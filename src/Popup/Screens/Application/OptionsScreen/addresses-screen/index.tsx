import React from 'react';
import {connect} from 'react-redux';
import {Wallet} from '@plark/wallet-core';

import {Coins} from 'Core';
import {IStore, IWalletStore} from 'Core/Declarations/Store';
import {ICoinWallet} from 'Core/Declarations/Wallet';

import {CoinSelect} from './coin-select';
import {AddressList} from './address-list';
import './address-screen.scss';


type TAddressOwnProps = {};
type TAddressStoreProps = {
    currentCoin: Coins.CoinSymbol;
    coins: Coins.CoinSymbol[];
    wallets: IWalletStore;
};
type TAddressesProps = TAddressOwnProps & TAddressStoreProps;

type TAddressesState = {
    activeCoin?: Coins.CoinSymbol;
};

class AddressesScreenComponent extends React.PureComponent<TAddressesProps, TAddressesState> {

    public readonly state: TAddressesState = {
        activeCoin: null
    };

    public constructor(props: TAddressesProps) {
        super(props);

        this.state.activeCoin = props.currentCoin;
    }

    protected onSelectCoin = (symbol: Coins.CoinSymbol) => {
        this.setState({activeCoin: symbol});
    };

    protected getWDProvider(): Wallet.Provider.WDProvider {
        const wallet: ICoinWallet = this.props.wallets[this.state.activeCoin];
        const {walletData} = wallet;

        return new Wallet.Provider.WDProvider(walletData);
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className="page-head address-list-head">
                    <h1 className="title">Your Addresses</h1>
                    <CoinSelect wallets={this.props.wallets}
                                coins={this.props.coins}
                                activeSymbol={this.state.activeCoin}
                                onSelectCoin={this.onSelectCoin}
                    />
                </div>

                <AddressList coinSymbol={this.state.activeCoin} wdProvider={this.getWDProvider()}/>
            </div>
        );
    }
}

const mapStateToProps = (store: IStore, ownProps: TAddressOwnProps): TAddressStoreProps => {
    return {
        currentCoin: store.Coin.currentCoinKey,
        coins: store.Coin.coins,
        wallets: store.Wallet
    }
};

export const AddressesScreen = connect(mapStateToProps)(AddressesScreenComponent);
