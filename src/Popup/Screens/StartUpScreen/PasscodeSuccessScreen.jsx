import React from 'react';
import ReactSVG from 'react-svg';
import {connect} from 'react-redux';
import proxyStore from 'Popup/Store';
import {Button} from 'Popup/UI';
import {mapWelcomeDispatchers} from 'Popup/Store/KeyringConnector';
import {WelcomeLink, WelcomeLayout} from './Parts';

@connect(null, mapWelcomeDispatchers)
export class PasscodeSuccessScreen extends React.Component {
    onBack = () => {
        proxyStore.dispatch({type: "WELCOME::CLEAR_PASSCODE"});
    };

    onNext = () => {
        this.props.pushWelcomeLocation("/startup/coins");
    };

    render() {

        const eventProps = {
            className: "startup-passcode",
            trackLabel: "startup-passcode-success",
            onPressEnter: this.onNext
        };

        return (
            <WelcomeLayout {...eventProps}>
                <ReactSVG
                    path="/images/icons/tick.svg"
                    className="success-icon"
                    wrapperClassName="success-icon-wrapper"
                />

                <div className="topic success-topic">
                    <h1 className="topic__title">New Passcode<br/> Created Successfully</h1>
                </div>

                <Button onClick={this.onNext} className="btn startup-welcome-button">Process</Button>

                <WelcomeLink
                    to="/startup/passcode"
                    className="startup-back-link"
                    onClick={this.onBack}
                >← Back to previous screen</WelcomeLink>
            </WelcomeLayout>
        );
    }
}
