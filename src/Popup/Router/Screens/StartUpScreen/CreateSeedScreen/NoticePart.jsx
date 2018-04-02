import React from 'react';
import ReactSVG from 'react-svg';
import {KeyboardHandler} from 'Popup/Router/SystemComponent';
import {Button} from "Popup/UI";
import screenHistory from 'Popup/ScreenAddressHistory';


export default class NoticeScreen extends React.Component {

    onNext = () => {
        screenHistory.push("/startup/create/phrase");
    };

    render() {
        return (<div className="startup-create-notice">
            <KeyboardHandler onPressEnter={this.onNext}/>
            <ReactSVG
                path={`/images/icons/notice.svg`}
                className="startup-create-notice__icon"
            />

            <div className="topic">
                <h1 className="topic__title">Backup Phrase</h1>
                <p className="topic__desc">
                    Write down each word, in order, on a piece of paper. Store your Backup Phrase <br/>
                    in a secure and safe location, where you keep other important documents. <br/>
                    Should you lose your Backup Phrase, your money may be accessed by the <br/>
                    third party, even if they do not know your Wallet PIN.
                </p>
            </div>

            <Button className="startup-welcome-button" onClick={this.onNext}>Proceed</Button>
        </div>);
    }
}