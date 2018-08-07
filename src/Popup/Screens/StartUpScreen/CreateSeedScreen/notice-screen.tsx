import React from 'react';
import ReactSVG from 'react-svg';
import screenHistory from 'Popup/ScreenAddressHistory';
import { KeyboardHandler } from 'Popup/SystemComponent';
import { Button } from 'Popup/UI';

export class NoticeScreen extends React.PureComponent {
    public render(): JSX.Element {
        return (
            <div className="startup-create-notice">
                <KeyboardHandler onPressEnter={this.onNext} />
                <ReactSVG
                    path={`/images/icons/notice.svg`}
                    className="startup-create-notice__icon"
                />

                <div className="topic">
                    <h1 className="topic__title">Backup Phrase</h1>
                    <p className="topic__desc">
                        Write down each word in order on a piece of paper.
                        Store your Backup Phrase in a secure and safe location, where you keep other important
                        documents.
                        Should you lose your Backup Phrase, your money may be accessed by a third party, even if
                        they don’t know your Wallet PIN.
                    </p>
                </div>

                <Button className="startup-welcome-button" onClick={this.onNext}>Proceed</Button>
            </div>
        );
    }

    protected onNext = (): void => {
        screenHistory.push('/startup/create/phrase');
    };
}
