import React from 'react';
import ReactSVG from 'react-svg';
import {Controller} from "Core/Actions";
import screenAddressHistory from 'Popup/ScreenAddressHistory';
import {Button} from "Popup/Router/UIComponents";
import {Background} from 'Popup/Service';
import ModalLayout from "../ModalLayout";
import {modalObserverInstance} from "../Observer";

export default class ResetWallet extends React.Component {

    resetWallet = () => {
        Background
            .sendRequest(Controller.GlobalEvent.ClearAllData)
            .then(() => {
                screenAddressHistory.push('/startup');
                modalObserverInstance.closeModal();
            })
    };

    render() {
        return (<ModalLayout>
            <div className="reset-popup">
                <ReactSVG
                    path={`/images/icons/notice.svg`}
                    className="svg-notice"
                    wrapperClassName="svg-notice-wrapper reset-popup__svg"
                />

                <h2 className="title">Are You Sure You Want to Reset Berrywallet?</h2>
                <p className="desc">
                    This action will reset your current Backup Phrase and your wallet preferences.
                    Make sure you have your written Backup Phrase or you will not be able to access your funds.
                </p>

                <Button onClick={this.resetWallet}>Reset</Button>
            </div>
        </ModalLayout>);
    }
}