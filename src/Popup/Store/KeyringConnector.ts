import screenHistory from 'Popup/ScreenAddressHistory';
import { Dispatch } from 'react-redux';

export const mapWelcomeProps = (state, ownProps) => {
    return {
        keyring: state.Keyring,
        welcome: state.Welcome,
    };
};

export interface IWelcomeDispatcher {
    setWelcomeLocation: (location) => void;
    pushWelcomeLocation: (location) => any;
}

export const mapWelcomeDispatchers = (dispatch: Dispatch<Store.TStore>): IWelcomeDispatcher => {

    const setWelcomeLocation = (location) => {
        return dispatch({
            type: 'WELCOME::SET_LOCATION',
            location: location,
        });
    };

    const pushWelcomeLocation = (location) => {
        setWelcomeLocation(location);
        screenHistory.push(location);
    };

    return { setWelcomeLocation, pushWelcomeLocation };
};
