import {IGlobalStore} from "Core/Declarations/Store";
import {Reducer} from 'Core/Actions';

export const initialGlobalState: IGlobalStore = {
    iterator: 0,
    walletReady: false,
    location: {
        path: '/',
        context: {}
    }
};

const reduceLocation = (state: IGlobalStore, path: string, context: any = {}): IGlobalStore => {
    const location = {
        path: path,
        context: context
    };

    return Object.assign({}, state, {location: location});
};

export default function globalState(state: IGlobalStore = initialGlobalState, action) {

    switch (action.type) {
        case Reducer.GlobalAction.Increment:
            return Object.assign({}, state, {iterator: state.iterator + 1});

        case Reducer.GlobalAction.WalletReady:
            return Object.assign({}, state, {walletReady: true});

        case Reducer.GlobalAction.WalletReset:
            return Object.assign({}, state, {walletReady: false});

        case Reducer.GlobalAction.SetLocation:
            return reduceLocation(state, action.path, action.context);

        case Reducer.GlobalAction.ClearAllData:
            return initialGlobalState;
    }

    return state;
}