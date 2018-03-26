import React from 'react';
import {Background} from 'Popup/Service';
import {KeyringEvent} from 'Core/Actions/Controller';

import EnterSeedStep from './EnterSeedStep';
import SuccessSeedStep from './SuccessSeedStep';
import EnterPasscodeStep from './EnterPasscodeStep';
import SuccessPasscodeStep from './SuccessPasscodeStep';

const ForgotStep = {
    EnterSeed: 'ENTER_SEED',
    SuccessSeed: 'SUCCESS_SEED',
    EnterPasscode: 'ENTER_PASSCODE',
    SuccessPasscode: 'SUCCESS_PASSCODE'
};

export default class ForgotPasscode extends React.Component {

    state = {
        step: ForgotStep.EnterSeed,
        seed: null,
        passcode: null
    };

    onSeedSuccess = (seedWordArray) => {
        this.setState({
            seed: seedWordArray,
            step: ForgotStep.SuccessSeed
        });
    };

    toEnterPasscode = () => {
        this.setState({
            step: ForgotStep.EnterPasscode
        });
    };

    onPasscodeCreated = (newPasscode) => {

        const {seed} = this.state;

        this.setState(() => {
            return {
                step: ForgotStep.SuccessPasscode,
                passcode: newPasscode
            };
        });

        Background.sendRequest(KeyringEvent.SetNewPasscode, {
            passcode: newPasscode,
            seed: seed
        });
    };

    onGotIt = () => {
        Background.sendRequest(KeyringEvent.TryPassword, {
            passcode: this.state.passcode
        });
    };

    renderActualStep() {
        const {step, seed = null, passcode = null} = this.state;
        const {onError = null, hasError = false} = this.props;

        switch (step) {
            case ForgotStep.EnterSeed:
                return <EnterSeedStep onError={onError} onSeedSuccess={this.onSeedSuccess}/>;

            case ForgotStep.SuccessSeed:
                return <SuccessSeedStep toEnterPasscode={this.toEnterPasscode}/>;

            case ForgotStep.EnterPasscode:
                return <EnterPasscodeStep onError={onError} onCreatedPasscode={this.onPasscodeCreated}/>;

            case ForgotStep.SuccessPasscode:
                return <SuccessPasscodeStep onGotIt={this.onGotIt}/>;
        }
    }

    render() {
        const {onTypePassword, step} = this.props;

        return (
            <div className="modal-content enter-passcode-content">
                {this.renderActualStep()}
                {
                    [ForgotStep.EnterSeed].includes(step)
                        ? <button className="modal-special-link"
                                  onClick={onTypePassword}>← Back to passcode</button>
                        : null
                }
            </div>
        )
    }
}
