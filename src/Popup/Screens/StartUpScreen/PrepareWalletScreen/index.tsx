import React from 'react';
import Extberry from 'extberry';
import {StartUpEvent} from 'Core/Actions/Controller';
import {Background} from 'Popup/Service';
import screenHistory from 'Popup/ScreenAddressHistory';
import {Analytics} from 'Popup/Service';
import {Alert, BerrywalletLogo} from 'Popup/UI';

import "./startup-prepare.scss";

export class PrepareWalletScreen extends React.Component {

    public componentDidMount(): void {
        Background
            .sendRequest(StartUpEvent.Prepare)
            .then(this.onPreparedResponse);
    }

    protected onPreparedResponse = (): void => {
        Analytics.event('WELCOME', 'CREATE_WALLET_SUCCESS');

        setTimeout(() => {
            screenHistory.push('/');
            Alert.showAlert({
                message: 'Please wait while your wallets are being imported...',
                lifetime: 2500
            });
        }, 1000);
    };

    public render(): JSX.Element {
        return <div className="startup startup-prepare">
            <div className="startup-prepare-loader">
                <BerrywalletLogo className="startup-prepare-loader__logo"/>
                <div className="startup-prepare-loader__text">Initializing wallet...</div>
            </div>

            <div className="startup-prepare__version">v{Extberry.version}</div>
        </div>;
    }
}
