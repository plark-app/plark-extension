import React from 'react';

import { ActionList, UIActionItem } from 'Popup/UI';
import { openModal } from 'Popup/Modals';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';

export class SecurityScreen extends React.PureComponent {

    protected onViewBackupPhrase = () => {
        openModal('/view-backup-phrase');
    };

    protected getActions(): UIActionItem[] {
        return [{
            label: 'View Backup Phrase',
            onClick: this.onViewBackupPhrase,
        }];

        // return [{
        //     label: 'Change Passcode'
        // }, {
        //     label: 'Ask Passcode'
        // }, {
        //     label: 'Require Passcode'
        // }, {
        //     label: 'View Backup Phrase',
        //     onClick: this.onViewBackupPhrase
        // }];
    }

    public render(): JSX.Element {
        return (
            <div className="card -full-size -no-w-padding">
                <TrackScreenView trackLabel="option-security" />
                <h1 className="title">Security Settings</h1>

                <ActionList actions={this.getActions()} />
            </div>
        );
    }
}
