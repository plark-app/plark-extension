import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch, Redirect} from 'react-router-dom';
import {find} from 'lodash';

import {Coins} from 'Core';
import {IStore} from 'Core/Declarations/Store';
import {Selector} from 'Popup/Store';
import {ExchangeScreenComponent} from './ExchangeScreen';

export interface IExchangeRouterProps {
    selectedCoin: Coins.CoinInterface;
}

export interface IOwnProps {
}

export class ExchangeRouter extends React.Component<IExchangeRouterProps & IOwnProps, any> {

    redirectToMain = () => {
        const {selectedCoin} = this.props;

        let fromCoin: Coins.CoinInterface = null,
            toCoin: Coins.CoinInterface = null;

        if (selectedCoin.isTest()) {
            fromCoin = Coins.coinList[Coins.CoinSymbol.Bitcoin];
            toCoin = Coins.coinList[Coins.CoinSymbol.Ethereum];
        } else {
            fromCoin = selectedCoin;
            toCoin = find(Coins.getRealCoins(), (cn: Coins.CoinInterface) => {
                return cn.getKey() !== selectedCoin.getKey();
            });
        }

        return <Redirect to={`/app/exchange/${fromCoin.getKey()}/${toCoin.getKey()}`}/>
    };

    render() {
        return <Switch>
            <Route path="/app/exchange/:fromCoin/:toCoin" component={ExchangeScreenComponent}/>
            <Route path="/app/exchange" render={this.redirectToMain}/>
        </Switch>
    }
}

const mapStateToProps = (store: IStore) => {
    return {
        selectedCoin: Selector.currentCoinSelector(store)
    };
};

export const ExchangeRouterComponent = connect(mapStateToProps)(ExchangeRouter);