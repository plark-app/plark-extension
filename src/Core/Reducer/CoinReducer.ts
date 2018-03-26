import {each} from 'lodash';
import {Coins, Actions} from "Core";
import {ICoinStore} from "Core/Declarations/Store";
import {GlobalAction} from "Core/Actions/Reducer";

const initialCoinState: ICoinStore = {
    coins: [],
    tickers: {},
    blockHeights: {},
    currentCoinKey: Coins.CoinSymbol.Bitcoin,
    currentFiatKey: Coins.FiatSymbol.USDollar
} as ICoinStore;


const reduceSetCoinsState = (state: ICoinStore, coins: Coins.CoinSymbol[]) => {
    const data = {
        coins: coins,
        currentCoinKey: state.currentCoinKey
    };

    if (!coins.includes(state.currentCoinKey)) {
        data.currentCoinKey = coins[0] || Coins.CoinSymbol.Bitcoin;
    }

    return Object.assign({}, state, data);
};

export default function coinState(state: ICoinStore = initialCoinState, action): ICoinStore {

    const {type, ...payload} = action;

    switch (type) {
        case GlobalAction.ClearAllData:
            return initialCoinState;

        case Actions.Reducer.CoinAction.SetCoins:
            return reduceSetCoinsState(state, payload.coins);

        case Actions.Reducer.CoinAction.ClearCoins:
            return Object.assign({}, state, {coins: [], currentCoinKey: Coins.CoinSymbol.Bitcoin});

        case Actions.Reducer.CoinAction.SetCurrentFiat:
            return Object.assign({}, state, {currentFiatKey: payload.fiatKey});

        case Actions.Reducer.CoinAction.SetBlockHeight:
            return Object.assign({}, state, {
                blockHeights: {
                    ...state.blockHeights,
                    [payload.coinKey]: payload.blockHeight
                }
            });

        case Actions.Reducer.CoinAction.SetCurrentCoin:
            return Object.assign({}, state, {currentCoinKey: payload.coinKey});

        case Actions.Reducer.CoinAction.SetTickers: {
            const tickers = {...state.tickers};

            each(payload.tickers, (coinTicker: Coins.TickerInterface) => {
                tickers[coinTicker.key] = coinTicker;
            });

            return Object.assign({}, state, {tickers: tickers});
        }
    }

    return state;
}


export {
    initialCoinState
}