import React from 'react';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import { Notice } from 'svg';
import { Button } from 'Popup/UI';
import { openModal } from 'Popup/Modals';

export class ResetScreen extends React.Component {

    protected resetAllWallet = (): void => {
        openModal('/reset-wallet');
    };

    public render(): JSX.Element {
        return (
            <div className="card -full-size">
                <TrackScreenView trackLabel="option-reset" />
                <h1 className="title">Reset Berrywallet</h1>
                <div className="reset-content">
                    <Notice className="wallet-initializing__notice" />

                    <h2 className="title">Warning</h2>
                    <p>
                        This action will reset your current Backup Phrase and your wallet preferences (except your
                        Security PIN). Your funds will not be affected, but your transaction history will no longer
                        be available.
                    </p>

                    <br /><br />

                    <Button onClick={this.resetAllWallet} className="reset-button">Reset</Button>
                </div>
            </div>
        );
    }
}
