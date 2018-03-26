import React from 'react';
import {Link} from 'react-router-dom';

import WelcomeLink from 'Popup/Router/Screens/StartUpScreen/Parts/WelcomeLink';

import {mapWelcomeProps, mapWelcomeDispatchers} from 'Popup/Store/KeyringConnector';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';

export default class WelcomeScreen extends React.Component {
    render() {
        return (
            <div className="startup startup-welcome">
                <TrackScreenView trackLabel="startup-welcome"/>

                <div className="startup-wrapper">
                    <div className="topic startup-welcome-topic">
                        <h1 className="topic__title">
                            Would You Like to Create a New Wallet <br/>
                            or Import Existing One?
                        </h1>
                        <p className="topic__desc">
                            You can set up a new wallet or import the data <br/>
                            from the different wallet you already use.
                        </p>
                    </div>
                </div>

                <div>
                    <WelcomeLink to="/startup/import" className="btn startup-welcome-button -white">Import wallet</WelcomeLink>
                    <WelcomeLink to="/startup/create" className="btn startup-welcome-button">Create wallet</WelcomeLink>
                </div>


                <div className="startup-notice startup-welcome-notice">
                    BerryWallet© does not hold your keys for you. We cannot access accounts, recover backup phrases,
                    reset passcodes, nor reverse transactions. You are in charge of your own security. Always check
                    that the URL is correct and protect your keys.
                </div>
            </div>
        );
    }
}
