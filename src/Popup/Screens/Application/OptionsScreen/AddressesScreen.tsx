import React from 'react';
import {map, size} from 'lodash';
import {connect} from 'react-redux';
import {Wallet} from "@berrywallet/core";

import {Coins} from 'Core';
import {IStore, IWalletStore} from 'Core/Declarations/Store';
import {ICoinWallet} from "Core/Declarations/Wallet";
import {CoinIcon} from 'Popup/UI';


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

    protected setActiveCoin = (symbol: Coins.CoinSymbol) => {
        return () => this.setState({activeCoin: symbol});
    };

    protected renderCoinSelect = (symbol: Coins.CoinSymbol) => {
        const coin = Coins.coinList[symbol];

        const wallet: ICoinWallet = this.props.wallets[symbol];
        const {walletData} = wallet;
        if (!walletData) {
            return;
        }

        const txCount = size(walletData.txs);

        return (
            <div key={symbol} onClick={this.setActiveCoin(symbol)}>
                <CoinIcon coin={symbol} size={20}/>
                {coin.getKey()} - {coin.getName()}

                <div>{txCount} Transactions</div>
            </div>
        );
    };

    protected renderAddressList = () => {
        const wallet: ICoinWallet = this.props.wallets[this.state.activeCoin];
        const {walletData} = wallet;

        const pwProvider = new Wallet.Provider.WDProvider(walletData);

        const addressBalances = pwProvider.address.getAddrBalances();

        return <div className="currency-option-list">
            {map(addressBalances, (balance: Wallet.Entity.Balance, address: string) => {
                return <div className="row">{address}</div>
            })}
        </div>

    };

    public render(): JSX.Element {

        const {wallets, coins} = this.props;
        const selectedCoin: Coins.CoinInterface = Coins.coinList[this.state.activeCoin];

        return (
            <div>
                <div className="page-head">
                    <h1 className="title">Your Addresses</h1>

                    <div>
                        <CoinIcon coin={selectedCoin.getKey()} size={20}/>
                        {selectedCoin.getKey()} - {selectedCoin.getName()}
                    </div>
                    <div>{map(this.props.coins, this.renderCoinSelect)}</div>
                </div>

                <div className="">

                </div>

                <div>{this.renderAddressList()}</div>
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
