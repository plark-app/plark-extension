import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {Notice} from 'svg';

import {openModal, closeModal, ModalLayout} from '../../';
import {Controller} from 'Core/Actions';
import {Background} from 'Popup/Service';
import {Button} from 'Popup/UI';


import './view-backup-phrase.scss'

interface IProps {
    seed?: string[];
}

export class ViewBackupPhrase extends React.PureComponent<IProps> {

    protected closePhraseModal = () => {
        closeModal();
    };

    protected showPhraseModal = () => {
        Background
            .sendRequest(Controller.KeyringEvent.GetSeed)
            .then((seed: string[]) => {
                openModal('/view-backup-phrase/phrase', {
                    seed: seed
                });
            });
    };

    protected renderHomeComponent = () => {
        return (
            <div className="view-backup-phrase-popup">
                <Notice className="svg-notice" style={{marginBottom: '16px'}}/>

                <h2 className="title">View Backup Phrase</h2>
                <p className="desc">
                    Please view your Backup Phrase in private only. This Backup Phrase gives full access to
                    your funds, so do not share it with anyone.
                </p>

                <div className="modal-buttons">
                    <Button onClick={this.showPhraseModal}>Got it!</Button>
                </div>
            </div>
        );
    };

    protected renderPhraseComponent = () => {
        const {seed = []} = this.props;
        return (
            <div className="view-backup-phrase-popup">
                <h2 className="title">View Backup Phrase</h2>
                <p className="desc">
                    Please make sure you write it down in the exact order as shown on the screen below.
                </p>

                <div className="stack-card -black view-backup-phrase__phrase">{seed.join(' ')}</div>

                <div className="modal-buttons">
                    <Button onClick={this.closePhraseModal}>Close</Button>
                </div>
            </div>
        );
    };

    public render(): JSX.Element {
        return (
            <ModalLayout>
                <Switch>
                    <Route path='/view-backup-phrase' exact={true} render={this.renderHomeComponent}/>
                    <Route path='/view-backup-phrase/phrase' render={this.renderPhraseComponent}/>
                </Switch>
            </ModalLayout>
        );
    }
}