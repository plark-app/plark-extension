import React from 'react';
import classNames from 'classnames';
import {Button} from "Popup/UI";
import {KeyringEvent} from 'Core/Actions/Controller';
import {Background} from 'Popup/Service';

export default class EnterPasscodeModal extends React.Component {

    state = {
        passcode: ''
    };

    onPasscodeChange = (event) => {
        const passcode = event.target.value;

        this.setState(() => {
            return {passcode};
        });
    };

    componentDidMount() {
        setTimeout(() => {
            this.refs.passwordInput.focus();
        }, 50);
    }

    onSendPasscode = (event) => {
        const {passcode} = this.state;

        Background
            .sendRequest(KeyringEvent.TryPassword, {passcode: passcode})
            .catch((error) => {
                const {onError = null} = this.props;
                onError && onError('Oh snap! Wrong passcode. Please try again.')
            });

        event.preventDefault();
    };

    render() {
        const {hasError = false, onForgotPassword} = this.props;

        const inputProps = {
            placeholder: "Enter your passcode",
            className: classNames("passcode-input", {"-error": hasError}),
            value: this.state.passcode,
            onChange: this.onPasscodeChange,
            type: "password",
            ref: 'passwordInput'
        };

        return (
            <div className="modal-content enter-passcode-content">
                <div className="topic">
                    <h1 className="topic__title">Enter your passcode</h1>
                </div>
                <form onSubmit={this.onSendPasscode}>
                    <div className="startup-wrapper startup-passcode-wrapper"><input {...inputProps}/></div>
                    <div className="center">
                        <Button disabled={!this.state.passcode}>Enter</Button>
                    </div>
                </form>

                <button className="modal-special-link" onClick={onForgotPassword}>Forgotten your passcode?</button>
            </div>
        );
    }
}
