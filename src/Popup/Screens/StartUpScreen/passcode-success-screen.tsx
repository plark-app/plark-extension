import React from 'react';
import ReactSVG from 'react-svg';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import proxyStore from 'Popup/Store';
import { Button } from 'Popup/UI';
import { mapWelcomeDispatchers, IWelcomeDispatcher } from 'Popup/Store/keyring-connector';
import { WelcomeLink, WelcomeLayout } from './parts';

type ScreenOuterProps = RouteComponentProps<{}>;
type ScreenProps = ScreenOuterProps & IWelcomeDispatcher;

class PasscodeSuccessScreenComponent extends React.Component<ScreenProps> {
    public render(): JSX.Element {
        const eventProps = {
            className: 'startup-passcode',
            trackLabel: 'startup-passcode-success',
            onPressEnter: this.onNext,
        };

        return (
            <WelcomeLayout {...eventProps}>
                <ReactSVG
                    path="/images/icons/tick.svg"
                    className="success-icon"
                    wrapperClassName="success-icon-wrapper"
                />

                <div className="topic success-topic">
                    <h1 className="topic__title">New Passcode<br /> Created Successfully</h1>
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

    protected onBack = (): void => {
        proxyStore.dispatch({ type: "WELCOME::CLEAR_PASSCODE" });
    };

    protected onNext = (): void => {
        this.props.pushWelcomeLocation("/startup/coins");
    };
}

export const PasscodeSuccessScreen
    = connect<ScreenOuterProps>(null, mapWelcomeDispatchers)(PasscodeSuccessScreenComponent);
