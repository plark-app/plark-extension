import { Coin } from '@plark/wallet-core';
import { OptionAction, GlobalAction } from 'Core/Actions/Reducer';
import { IOptionStore } from 'Core/Declarations/Store';

export const initialOptionState: IOptionStore = {
    fee: Coin.FeeTypes.Medium,
};

export default function coinState(state: IOptionStore = initialOptionState, action): IOptionStore {
    const { type, ...payload } = action;

    switch (type) {
        case GlobalAction.ClearAllData:
            return initialOptionState;

        case OptionAction.SetFee:
            return Object.assign({}, state, { fee: payload.fee });
    }

    return state;
}
