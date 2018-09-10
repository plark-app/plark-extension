import React from 'react';
import cn from 'classnames';
import { filter, map, includes, values } from 'lodash';
import { connect } from 'react-redux';
import { coinList, CoinInterface, CoinSymbol } from 'Core/Coins';
import { delay } from 'Core/utils';
import { Controller } from 'Core/Actions';
import { IWalletStore } from 'Core/Declarations/Store';
import { CoinIcon } from 'Popup/components/coin-icon';
import { Background, Analytics } from 'Popup/Service';
import { InputCheck, Alert, EmptyDummy } from 'Popup/UI';

import { SearchInputComponent } from '../components';

type WalletsScreenState = {
    search: string;
    loadingCoins: CoinInterface[];
};

class WalletsScreenComponent extends React.PureComponent<WalletsScreenProps, WalletsScreenState> {
    public state: WalletsScreenState = {
        search: '',
        loadingCoins: [],
    };

    public render(): JSX.Element {
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
                    <EmptyDummy
                        title="No Such Wallet Yet"
                        description="Unfortunately, this wallet is unavailable at the moment. More wallets are coming soon."
                        show={filteredCoinList.length === 0}
                    />
                </div>
            </div>
        );
    }

    protected onChangeSearch = (searchValue: string): void => {
        this.setState({ search: searchValue });
    };

    protected getCoinList(): CoinInterface[] {
        const searchString = this.state.search.toLowerCase();

        if (!!searchString) {
            return filter(coinList, (coin) => {
                return [coin.getName(), coin.getKey()].join(' ').toLowerCase().indexOf(searchString) >= 0;
            });
        }

        return values(coinList);
    }

    protected renderCoinRow = (coin): JSX.Element => {
        const { coins = [] } = this.props;
        const isLoading = this.coinIsLoading(coin.getKey());

        return (
            <label key={coin.getKey()} className={cn('currency-option-item', 'row', '-coin', `text-${coin.getKey()}`)}>
                <div className="currency-option-item__title">
                    <CoinIcon className="currency-option-item__coin-icon" size={30} coin={coin.getKey()} />
                    {coin.getKey()} - {coin.getName()}
                </div>

                <InputCheck
                    type="checkbox"
                    name="coin-select"
                    isLoading={isLoading}
                    checked={includes(coins, coin.getKey())}
                    value={coin.getKey()}
                    onChange={this.onChangeCoins}
                />
            </label>
        );
    };

    protected onChangeCoins = async (event): Promise<void> => {
        const { coins } = this.props;

        const toTriggerCoin = event.currentTarget.value;
        if (this.coinIsLoading(toTriggerCoin)) {
            return;
        }

        let type = null,
            analiticsEvent: string;
        if (includes(coins, toTriggerCoin)) {
            if (coins.length === 1) {
                Alert.showAlert({
                    message: "Uh-oh! Please select at least one wallet.",
                });
                return;
            }

            type = Controller.WalletEvent.DisActivateCoin;
            analiticsEvent = 'REMOVE_WALLET';
        } else {
            type = Controller.WalletEvent.ActivateCoin;
            analiticsEvent = 'ADD_WALLET';
        }

        this.startCoinLoading(toTriggerCoin);

        await Background.sendRequest(type, { coin: toTriggerCoin });
        Analytics.event('SETTINGS', analiticsEvent, toTriggerCoin);

        await delay(500);

        this.endCoinLoading(toTriggerCoin);
    };

    protected coinIsLoading = (coin) => {
        const wd = this.props.wallets[coin];

        return this.state.loadingCoins.findIndex((cn) => cn === coin) >= 0 || (wd && wd.loading);
    };

    protected startCoinLoading = (coin) => {
        this.setState((state) => {
            return { loadingCoins: [...state.loadingCoins, coin] };
        });
    };

    protected endCoinLoading = (coin) => {
        this.setState((state) => {
            return {
                loadingCoins: filter(state.loadingCoins, (cn) => (cn && cn !== coin)),
            };
        });
    };
}

type OwnProps = {};
type StoreProps = {
    coins: CoinSymbol[];
    wallets: IWalletStore;
};

type WalletsScreenProps = OwnProps & StoreProps;

const mapStateToProps = (store: Store.TStore): StoreProps => {
    return {
        coins: store.Coin.coins,
        wallets: store.Wallet,
    };
};

export const WalletsScreen = connect(mapStateToProps)(WalletsScreenComponent);
