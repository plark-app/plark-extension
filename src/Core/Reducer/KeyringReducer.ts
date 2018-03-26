import {IKeyringStore} from 'Core/Declarations/Store';
import {Reducer} from 'Core/Actions';

export const initialKeyringState: IKeyringStore = {
    vault: null,
    needPassword: true
};

export default function keyringState(state: IKeyringStore = initialKeyringState, action): IKeyringStore {

    switch (action.type) {
        case Reducer.GlobalAction.ClearAllData:
            return initialKeyringState;

        case Reducer.KeyringAction.SetSeedVault:
            return Object.assign({}, state, {vault: action.vault});

        case Reducer.KeyringAction.ClearSeedVault:
            return Object.assign({}, state, {vault: null});

        case Reducer.KeyringAction.NeedPassword:
            return Object.assign({}, state, {needPassword: true});

        case Reducer.KeyringAction.HasPassword:
            return Object.assign({}, state, {needPassword: false});
    }

    return state;
}