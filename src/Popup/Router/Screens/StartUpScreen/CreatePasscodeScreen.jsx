import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import proxyStore from 'Popup/Store';
import {showAlert} from "Popup/Router/Alert";
import {Button} from "Popup/Router/UIComponents";
import WelcomeLink from 'Popup/Router/Screens/StartUpScreen/Parts/WelcomeLink';
import {MIN_PASSCODE_CHARS, validatePasscode} from 'Core/Passcode';
import {mapWelcomeDispatchers} from 'Popup/Store/KeyringConnector';
import WelcomeLayout from './Parts/WelcomeLayout';

const ScreenStates = {
    CREATE: 'create',
    RETYPE: 'retype'
};

@connect(null, mapWelcomeDispatchers)
export default class CreatePasscodeScreen extends React.Component {
    state = {
        inputData: '',
        valid: false,
        screenState: ScreenStates.CREATE,
        passcode: null,
        error: false
    };

    componentDidMount() {
        this.refs.passwordInput.focus();
    }

    onChangePasscodeInput = (event) => {
        const value = event.target.value;

        this.setState(() => {
            return {
                inputData: value,
                valid: value.length >= MIN_PASSCODE_CHARS,
                error: false
            }
        });
    };


    onCreatePasscode = () => {
        if (!this.state.valid) {
            return false;
        }

        validatePasscode(this.state.inputData);

        this.setState(() => {
            return {
                inputData: '',
                valid: false,
                screenState: ScreenStates.RETYPE,
                passcode: this.state.inputData,
                error: false
            };
        });

        this.refs.passwordInput.focus();
    };

    onCheckPasscode = () => {
        if (!this.state.valid) {
            return false;
        }

        const retypedPasscode = this.state.inputData;

        validatePasscode(retypedPasscode);

        if (retypedPasscode !== this.state.passcode) {
            throw new Error("Oh snap! Wrong passcode. Please try again.");
        }

        proxyStore.dispatch({
            type: "WELCOME::SET_PASSCODE",
            passcode: this.state.passcode
        });

        this.props.pushWelcomeLocation('/startup/passcode-success');

    };

    onBack = () => {
        proxyStore.dispatch({type: "WELCOME::CLEAR_PASSCODE"});
    };

    onNext = (event) => {
        try {
            switch (this.state.screenState) {
                case ScreenStates.CREATE:
                    return this.onCreatePasscode(event);

                case ScreenStates.RETYPE:
                    return this.onCheckPasscode(event);
            }
        } catch (error) {
            this.setState(() => {
                return {error: true};
            });

            showAlert({
                message: error.message,
                noBody: true,
                onClose: () => {
                    this.setState(() => {
                        return {error: false};
                    });
                }
            });
        }

        return false;
    };


    renderPasscodeInput() {
        const inputProps = {
            ref: 'passwordInput',
            placeholder: "Enter your passcode",
            className: classNames("passcode-input", {"-error": this.state.error}),
            value: this.state.inputData,
            onChange: this.onChangePasscodeInput,
            type: "password"
        };

        return <input {...inputProps} />;
    }

    render() {

        const stateTitle = this.state.screenState === ScreenStates.CREATE ? "Create passcode" : "Retype passcode";

        const layoutProps = {
            className: "startup-passcode",
            trackLabel: "startup-passcode",
            topicTitle: stateTitle,
            topicDescription: `${MIN_PASSCODE_CHARS} character minimum`,
            onPressEnter: this.onNext
        };

        return (
            <WelcomeLayout {...layoutProps}>
                <div className="startup-wrapper startup-passcode-wrapper">{this.renderPasscodeInput()}</div>

                <Button onClick={this.onNext}
                        disabled={!this.state.valid}
                        className="startup-welcome-button"
                >{stateTitle}</Button>

                <WelcomeLink
                    to="/startup"
                    className="startup-back-link"
                    onClick={this.onBack}
                >← Back to previous screen</WelcomeLink>
            </WelcomeLayout>
        );
    }
}
