import {IWelcomeStore} from 'Core/Declarations/Store';
import {Reducer} from 'Core/Actions';

export const initialWelcomeState: IWelcomeStore = {
    location: null,
    seed: null,
    passcode: null,
    coins: []
};

export default function welcomeState(state: IWelcomeStore = initialWelcomeState, action) {

    switch (action.type) {
        case Reducer.GlobalAction.ClearAllData:
            return initialWelcomeState;

        // SEED
        case Reducer.WelcomeAction.SetSeed:
            return Object.assign({}, state, {seed: action.seed});

        case Reducer.WelcomeAction.ClearSeed:
            return Object.assign({}, state, {seed: null});


        // PASSCODE
        case Reducer.WelcomeAction.SetPasscode:
            return Object.assign({}, state, {passcode: action.passcode});

        case Reducer.WelcomeAction.ClearPasscode:
            return Object.assign({}, state, {passcode: null});


        // COINS
        case Reducer.WelcomeAction.SetCoins:
            return Object.assign({}, state, {coins: action.coins});

        case Reducer.WelcomeAction.ClearCoins:
            return Object.assign({}, state, {coins: []});


        // LOCATIONS
        case Reducer.WelcomeAction.SetLocation:
            return Object.assign({}, state, {location: action.location});

        // CLEAR
        case Reducer.WelcomeAction.Clear:
            return initialWelcomeState;
    }

    return state;
}