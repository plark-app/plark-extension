import React from 'react';
import {Background} from 'Popup/Service';
import {StartUpEvent} from 'Core/Actions/Controller';
import screenHistory from 'Popup/ScreenAddressHistory';
import {showAlert} from "Popup/Router/Alert";

export default class PrepareWalletScreen extends React.Component {

    componentDidMount() {
        Background
            .sendRequest(StartUpEvent.Prepare)
            .then(this.onPreparedResponse);

        showAlert({
            message: 'Please wait while your wallets are being imported...',
            lifetime: 2000
        });
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
