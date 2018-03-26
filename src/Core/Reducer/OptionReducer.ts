import {each} from 'lodash';
import {Coin} from '@berrywallet/core';
import {OptionAction, GlobalAction} from "Core/Actions/Reducer";
import {IOptionStore} from "Core/Declarations/Store";

const initialOptionState: IOptionStore = {
    fee: Coin.FeeTypes.Medium
} as IOptionStore;

export default function coinState(state: IOptionStore = initialOptionState, action): IOptionStore {
    const {type, ...payload} = action;

    switch (type) {
        case GlobalAction.ClearAllData:
            return initialOptionState;

        case OptionAction.SetFee:
            return Object.assign({}, state, {fee: payload.fee});
    }

    return state;
}


export {
    initialOptionState
}