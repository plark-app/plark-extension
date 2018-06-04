import React from 'react';
import {WelcomeLink} from './Parts';
import {mapWelcomeProps, mapWelcomeDispatchers} from 'Popup/Store/KeyringConnector';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';

export class WelcomeScreen extends React.Component {
    public render(): JSX.Element {
        return (
            <div className="startup startup-welcome">
                <TrackScreenView trackLabel="startup-welcome"/>

                <div className="startup-wrapper">
                    <div className="topic startup-welcome-topic">
                        <h1 className="topic__title">
                            Would You Like to Create a New Wallet <br/>
                            or Import an Existing One?
                        </h1>
                        <p className="topic__desc">
                            You can set up a new wallet or import the data <br/>
                            from a different wallet you already use.
                        </p>
                    </div>
                </div>

                <div>
                    <WelcomeLink to="/startup/import" className="btn startup-welcome-button -white">Import wallet</WelcomeLink>
                    <WelcomeLink to="/startup/create" className="btn startup-welcome-button">Create a wallet</WelcomeLink>
                </div>


                <div className="startup-notice startup-welcome-notice">
                    Berrywallet© does not hold your keys for you. We cannot access accounts, recover backup phrases,
                    reset passcodes, or reverse transactions. You are in charge of your own security. Always check
                    that the URL is correct and protect your keys.
                </div>
            </div>
        );
    }
}
