import React from 'react';
import Extberry from 'extberry';
import screenHistory from 'Popup/ScreenAddressHistory';
import { BerrywalletLogo } from 'svg';
import { delay } from 'Core/utils';
import { StartUpEvent } from 'Core/Actions/Controller';
import { Background } from 'Popup/Service';
import { Analytics } from 'Popup/Service';
import { Alert } from 'Popup/UI';

import './startup-prepare.scss';

export class PrepareWalletScreen extends React.Component {

    public async componentDidMount(): Promise<void> {
        await Background.sendRequest(StartUpEvent.Prepare);

        Analytics.event('WELCOME', 'CREATE_WALLET_SUCCESS');

        await delay(1000);

        screenHistory.push('/');
        Alert.showAlert({
            message: 'Please wait while your wallets are being imported...',
            lifetime: 2500,
        });
    }

    public render(): JSX.Element {
        return (
            <div className="startup startup-prepare">
                <div className="startup-prepare-loader">
                    <BerrywalletLogo className="startup-prepare-loader__logo" />
                    <div className="startup-prepare-loader__text">Initializing wallet...</div>
                </div>

                <div className="startup-prepare__version">v{Extberry.version}</div>
            </div>
        );
    }
}
