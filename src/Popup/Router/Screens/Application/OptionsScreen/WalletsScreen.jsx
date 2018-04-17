import React from 'react';
import {filter, map, includes} from 'lodash';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Background} from 'Popup/Service';
import {InputCheck, Alert} from 'Popup/UI';
import {Analytics} from "Popup/Service";
import {coinList} from 'Core/Coins';
import {Controller} from "Core/Actions";

import SearchInputComponent from './Components/SearchInputComponent';
import NotFoundComponent from './Components/NotFoundComponent';


const mapStateToProps = (store) => {
    return {
        coins: store.Coin.coins,
        wallets: store.Wallet
    }
};

@connect(mapStateToProps)
export default class WalletsScreen extends React.Component {

    state = {
        search: '',
        loadingCoins: []
    };

    onChangeSearch = (searchValue) => {
        this.setState(() => {
            return {search: searchValue};
        });
    };

    getCoinList() {
        const searchString = this.state.search.toLowerCase();

        if (!!searchString) {
            return filter(coinList, (coin) => {
                return [coin.getName(), coin.getKey()].join(' ').toLowerCase().indexOf(searchString) >= 0;
            });
        }

        return Object.values(coinList);
    }

    coinIsLoading = (coin) => {
        const wd = this.props.wallets[coin];

        return this.state.loadingCoins.findIndex((cn) => cn === coin) >= 0 || (wd && wd.loading);
    };

    startCoinLoading = (coin) => {
        this.setState((state) => {
            return {loadingCoins: [...state.loadingCoins, coin]}
        });
    };

    endCoinLoading = (coin) => {
        this.setState((state) => {
            return {
                loadingCoins: filter(state.loadingCoins, (cn) => (cn && cn !== coin))
            }
        });
    };

    onChangeCoins = (event) => {
        const {coins} = this.props;

        const toTriggerCoin = event.currentTarget.value;
        if (this.coinIsLoading(toTriggerCoin)) {
            return;
        }

        let type = null, callback = null;
        if (includes(coins, toTriggerCoin)) {
            if (coins.length === 1) {
                Alert.showAlert({
                    message: "Uh-oh! Please select at least one wallet."
                });
                return;
            }

            type = Controller.WalletEvent.DisActivateCoin;
            callback = () => {
                Analytics.event('Coin', 'remove', toTriggerCoin);

                return toTriggerCoin;
            }
        } else {
            type = Controller.WalletEvent.ActivateCoin;
            callback = () => {
                Analytics.event('Coin', 'add', toTriggerCoin);

                return toTriggerCoin;
            };
        }

        this.startCoinLoading(toTriggerCoin);

        Background
            .sendRequest(type, {coin: toTriggerCoin})
            .then(callback)
            .then(() => {
                setTimeout(() => {
                    this.endCoinLoading(toTriggerCoin);
                }, 500);
            });
    };

    renderCoinRow = (coin) => {
        const {coins = []} = this.props;
        const isLoading = this.coinIsLoading(coin.getKey());

        return (
            <label key={coin.getKey()}
                   className={classNames('currency-option-item', 'row', '-coin', `text-${coin.getKey()}`)}>
                <div className="currency-option-item__title">
                    <img
                        src={`/images/coins/${coin.getKey()}.svg`}
                        alt={coin.getKey()}
                        className={"currency-option-item__coin-icon"}
                    />
                    {coin.getKey()} - {coin.getName()}
                </div>
                <InputCheck isLoading={isLoading}
                            type="checkbox"
                            name="coin-select"
                            checked={coins.includes(coin.getKey())}
                            value={coin.getKey()}
                            onChange={this.onChangeCoins}
                />
            </label>
        );
    };

    render() {
        const filteredCoinList = this.getCoinList();

        return (
            <div className="currency-option">
                <div className="currency-option-head">
                    <h1 className="title currency-option-head__title">Add new wallets</h1>
                    <SearchInputComponent
                        onChangeSearch={this.onChangeSearch}
                        placeholder="Search Wallet"
                    />
                </div>

                <div className="currency-option-list">
                    {map(filteredCoinList, this.renderCoinRow)}
                    <NotFoundComponent
                        title="No Such Wallet Yet"
                        description="Unfortunately, this wallet is unavailable at the moment. More wallets are coming soon."
                        show={filteredCoinList.length === 0}
                    />
                </div>
            </div>
        );
    }
}
