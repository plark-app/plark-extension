import React from 'react';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import {ActionList, UIActionItem} from 'Popup/UI';

export class SecurityScreen extends React.PureComponent {

    protected onViewBackupPhrase = () => {

    };

    protected getActions(): UIActionItem[] {
        return [{
            label: 'Change Passcode'
        }, {
            label: 'Ask Passcode'
        }, {
            label: 'Require Passcode'
        }, {
            label: 'View Backup Phrase',
            onClick: this.onViewBackupPhrase
        }];
    }

    public render(): JSX.Element {
        return (
            <div className="card -full-size -no-w-padding">
                <TrackScreenView trackLabel="option-security"/>
                <h1 className="title">Security Settings</h1>

                <ActionList actions={this.getActions()}/>
            </div>
        );
    }
}
