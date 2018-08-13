import React from 'react';
import { includes } from 'lodash';
import { Background } from 'Popup/Service';
import { KeyringEvent } from 'Core/Actions/Controller';

import EnterSeedStep from './EnterSeedStep';
import SuccessSeedStep from './SuccessSeedStep';
import EnterPasscodeStep from './EnterPasscodeStep';
import SuccessPasscodeStep from './SuccessPasscodeStep';

interface IProps {
    hasError: boolean;
    onError: any;
    onTypePassword: any;
}

interface IState {
    step: string,
    seed?: string,
    passcode?: string
}

const ForgotStep = {
    EnterSeed: 'ENTER_SEED',
    SuccessSeed: 'SUCCESS_SEED',
    EnterPasscode: 'ENTER_PASSCODE',
    SuccessPasscode: 'SUCCESS_PASSCODE',
};

export class ForgotPasscode extends React.Component<IProps, IState> {

    state = {
        step: ForgotStep.EnterSeed,
        seed: null,
        passcode: null,
    };

    public onSeedSuccess = (seedWordArray) => {
        this.setState({
            seed: seedWordArray,
            step: ForgotStep.SuccessSeed,
        });
    };

    public toEnterPasscode = () => {
        this.setState({
            step: ForgotStep.EnterPasscode,
        });
    };

    public onPasscodeCreated = (newPasscode) => {

        const { seed } = this.state;

        this.setState(() => {
            return {
                step: ForgotStep.SuccessPasscode,
                passcode: newPasscode,
            };
        });

        Background.sendRequest(KeyringEvent.SetNewPasscode, {
            passcode: newPasscode,
            seed: seed,
        });
    };

    public render(): JSX.Element {
        return (
            <div className="modal-content enter-passcode-content">
                {this.renderActualStep()}
                {this.renderBackButton()}
            </div>
        );
    }

    protected onGotIt = (): void => {
        Background.sendRequest(KeyringEvent.TryPassword, {
            passcode: this.state.passcode,
        });
    };

    protected renderActualStep(): JSX.Element {
        const { step } = this.state;
        const { onError = null } = this.props;

        switch (step) {
            case ForgotStep.EnterSeed:
                return <EnterSeedStep onError={onError} onSeedSuccess={this.onSeedSuccess} />;

            case ForgotStep.SuccessSeed:
                return <SuccessSeedStep toEnterPasscode={this.toEnterPasscode} />;

            case ForgotStep.EnterPasscode:
                return <EnterPasscodeStep onError={onError} onCreatedPasscode={this.onPasscodeCreated} />;

            case ForgotStep.SuccessPasscode:
                return <SuccessPasscodeStep onGotIt={this.onGotIt} />;
        }
    }

    protected renderBackButton(): JSX.Element | null {
        const { onTypePassword } = this.props;
        const { step } = this.state;

        if (includes([ForgotStep.EnterSeed], step)) {
            return <button className="modal-special-link" onClick={onTypePassword}>← Back to passcode</button>;
        }

        return null;
    }
}
