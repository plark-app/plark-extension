import React from 'react';
import {Background} from 'Popup/Service';
import {StartUpEvent} from 'Core/Actions/Controller';
import screenHistory from 'Popup/ScreenAddressHistory';

export default class PrepareWalletScreen extends React.Component {

    componentDidMount() {
        Background
            .sendRequest(StartUpEvent.Prepare)
            .then(this.onPreparedResponse);
    }

    onPreparedResponse = (response) => {
        if ("message" in response) {
            screenHistory.push('/');
        }
    };

    render() {
        return (
            <div className="startup startup-prepare">
                Loading...
            </div>
        );
    }
}
