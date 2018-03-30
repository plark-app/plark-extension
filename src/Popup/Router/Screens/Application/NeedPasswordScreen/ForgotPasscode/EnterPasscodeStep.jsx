import React from 'react';
import classNames from 'classnames';
import {MIN_PASSCODE_CHARS, validatePasscode} from 'Core/Passcode';
import {Button} from "Popup/Router/UIComponents";

const ScreenStates = {
    CREATE: 'create',
    RETYPE: 'retype'
};

export default class EnterPasscodeStep extends React.Component {
    state = {
        inputData: '',
        valid: false,
        screenState: ScreenStates.CREATE,
        passcode: null
    };

    onChangePasscodeInput = (event) => {
        this.setState(() => {
            return {
                inputData: event.target.value,
                valid: event.target.value.length >= MIN_PASSCODE_CHARS
            };
        });
    };


    onSubmitPasscode = (event) => {
        event.preventDefault();

        if (!this.state.valid) {
            return;
        }

        try {
            validatePasscode(this.state.inputData);
        } catch (error) {
            this.props.onError('Oh snap! Wrong passcode. Please try again.');

            return;
        }

        switch (this.state.screenState) {
            case ScreenStates.CREATE:
                return this.onCreatePasscode();

            case ScreenStates.RETYPE:
                return this.onCheckPasscode();
        }
    };


    onCreatePasscode() {
        this.setState(() => {
            return {
                inputData: '',
                valid: false,
                screenState: ScreenStates.RETYPE,
                passcode: this.state.inputData
            };
        });
    }


    onCheckPasscode() {
        const retypedPasscode = this.state.inputData;
        const {onCreatedPasscode} = this.props;

        if (retypedPasscode !== this.state.passcode) {
            this.props.onError('Oh snap! Passcode is not same. Please try again.');

            return false;
        }

        onCreatedPasscode && onCreatedPasscode(this.state.passcode);
    }

    render() {
        const inputProps = {
            type: "password",
            value: this.state.inputData,
            onChange: this.onChangePasscodeInput,
            className: classNames("passcode-input", {"-error": this.props.hasError}),
            placeholder: "Enter your passcode"
        };

        return (
            <div>
                <div className="topic">
                    <h1 className="topic__title">
                        {this.state.screenState === ScreenStates.CREATE ? 'Create New Passcode' : 'Retype New Passcode'}
                    </h1>
                    <p className="topic__desc">{MIN_PASSCODE_CHARS} character minimum</p>
                </div>
                <form onSubmit={this.onSubmitPasscode}>
                    <div className="startup-wrapper startup-passcode-wrapper">
                        <input {...inputProps} />
                    </div>
                    <div className="text-center">
                        <Button disabled={!this.state.valid}>Create New Passcode</Button>
                    </div>
                </form>
            </div>
        );
    }
}
