import React from 'react';
import {Alert} from "Popup/UI";
import {Background} from 'Popup/Service';
import {StartUpEvent} from 'Core/Actions/Controller';
import screenHistory from 'Popup/ScreenAddressHistory';

export default class PrepareWalletScreen extends React.Component<any, any> {

    componentDidMount() {
        Background
            .sendRequest(StartUpEvent.Prepare)
            .then(this.onPreparedResponse);

        Alert.showAlert({
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
        return <div className="startup startup-prepare">Loading...</div>;
    }
}
