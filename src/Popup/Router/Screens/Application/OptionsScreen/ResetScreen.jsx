import React from 'react';
import ReactSVG from 'react-svg';
import {Button} from "Popup/Router/UIComponents";
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";
import {modalObserverInstance, ModalType} from "Popup/Router/Modals";


export default class ResetScreen extends React.Component {

    resetAllWallet = (event) => {
        modalObserverInstance.openModal(ModalType.ResetWallet);
    };

    render() {
        return (
            <div className="card -full-size">
                <TrackScreenView trackLabel="option-reset"/>

                <h1 className="title">Reset Berrywallet</h1>

                <div className="reset-content">
                    <ReactSVG
                        path={`/images/icons/notice.svg`}
                        className="wallet-initializing__notice"
                        wrapperClassName="wallet-initializing__notice-wrapper"
                    />

                    <h2 className="title">Warning</h2>
                    <p>
                        This action will reset your current Backup Phrase and your wallet preferences
                        (except your Security PIN). Your funds will not be affected, but your transaction history
                        will no longer be available.
                    </p>

                    <br/><br/>

                    <Button onClick={this.resetAllWallet} className="reset-button">Reset</Button>
                </div>
            </div>
        );
    }
}
