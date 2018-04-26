import React from 'react';
import exberryInstance from 'extberry';
import {Alert, BerrywalletLogo} from "Popup/UI";
import screenHistory from 'Popup/ScreenAddressHistory';

import "./startup-prepare.scss";

export class PrepareWalletScreen extends React.Component<any, any> {

    componentDidMount() {
        // Background.sendRequest(StartUpEvent.Prepare).then(this.onPreparedResponse);
    }

    onPreparedResponse = () => {
        setTimeout(() => {
            screenHistory.push('/');

            Alert.showAlert({
                message: 'Please wait while your wallets are being imported...',
                lifetime: 2500
            });
        }, 1000);
    };

    render() {
        return <div className="startup startup-prepare">
            <div className="startup-prepare-loader">
                <BerrywalletLogo className="startup-prepare-loader__logo"/>
                <div className="startup-prepare-loader__text">Initializing wallet...</div>
            </div>

            <div className="startup-prepare__version">v{exberryInstance.version}</div>
        </div>;
    }
}
