import React from 'react';
import ReactSVG from 'react-svg';
import proxyStore from 'Popup/Store';
import WelcomeLink from 'Popup/Router/Screens/StartUpScreen/Parts/WelcomeLink';



import {connect} from 'react-redux';
import WelcomeLayout from './Parts/WelcomeLayout';
import {Button} from "Popup/Router/UIComponents";
import {mapWelcomeDispatchers} from 'Popup/Store/KeyringConnector';
@connect(null, mapWelcomeDispatchers)
export default class PasscodeSuccessScreen extends React.Component {
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
