import React from 'react';
import {Notice} from 'svg';
import {Controller} from "Core/Actions";
import screenAddressHistory from 'Popup/ScreenAddressHistory';
import {Button} from "Popup/UI";
import {Background} from 'Popup/Service';
import {ModalLayout} from "../../ModalLayout";
import {closeModal} from "../../Observer";

import './reset-wallet.scss';

export class ResetWallet extends React.Component<any, any> {

    protected resetWallet = () => {
        Background
            .sendRequest(Controller.GlobalEvent.ClearAllData)
            .then(() => {
                screenAddressHistory.push('/startup');
                closeModal();
            });
    };

    public render(): JSX.Element {
        return (
            <ModalLayout>
                <div className="reset-popup">
                    <Notice className="svg-notice reset-popup__svg"/>

                    <h2 className="title">
                        Are You Sure You Want <br/>
                        to Reset Berrywallet?
                    </h2>
                    <p className="desc">
                        This action will reset your current Backup Phrase and your wallet preferences.
                        Make sure you have your written Backup Phrase or you will not be able to access your funds.
                    </p>

                    <div className="modal-buttons">
                        <Button onClick={this.resetWallet}>Reset</Button>
                    </div>
                </div>
            </ModalLayout>
        );
    }
}