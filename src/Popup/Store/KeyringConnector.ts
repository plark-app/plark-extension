import screenHistory from 'Popup/ScreenAddressHistory';

export const mapWelcomeProps = (state, ownProps) => {
    return {
        keyring: state.Keyring,
        welcome: state.Welcome
    }
};

export const mapWelcomeDispatchers = (dispatch) => {

    const dispatchWelcomeLocation = (location) => {
        return dispatch({
            type: 'WELCOME::SET_LOCATION',
            location: location
        });
    };

    return {
        setWelcomeLocation: dispatchWelcomeLocation,

        pushWelcomeLocation: (location) => {
            dispatchWelcomeLocation(location);
            screenHistory.push(location);
        }
    }
};