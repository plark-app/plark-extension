import React from 'react';
import {Alert} from 'Popup/UI';
import {TypePasscode} from './TypePasscode';
import {ForgotPasscode} from './ForgotPasscode';

const PasswordMode = {
    Type: 'TYPE',
    Forgot: 'FORGOT'
};

interface IModalState {
    mode: string;
    hasError: boolean;
}

export default class EnterPasscodeModal extends React.Component<any, IModalState> {

    public state: IModalState = {
        mode: PasswordMode.Type,
        hasError: false
    };

    public componentWillUnmount(): void {
        Alert.closeAlert();
    }

    protected onError = (errorMessage: string) => {
        Alert.showAlert({
            message: errorMessage,
            onClose: this.onCloseError,
            noBody: true
        });

        this.setState(this.hasErrorSetter(true));
    };

    protected onCloseError = () => {
        this.setState(this.hasErrorSetter(false));
    };

    protected hasErrorSetter = (hasError: boolean) => {
        return {hasError};
    };

    protected onSetScreenMode = (mode) => {
        return (event) => {
            this.setState(() => {
                return {
                    mode: mode,
                    hasError: false
                };
            })
        }
    };

    protected renderMode(): JSX.Element {
        const {hasError = false} = this.state;

        switch (this.state.mode) {
            case PasswordMode.Type:
                return <TypePasscode hasError={hasError}
                                     onError={this.onError}
                                     onForgotPassword={this.onSetScreenMode(PasswordMode.Forgot)}/>;


            case PasswordMode.Forgot:
                return <ForgotPasscode hasError={hasError}
                                       onError={this.onError}
                                       onTypePassword={this.onSetScreenMode(PasswordMode.Type)}/>
        }
    }

    render() {
        return (
            <div className="modal enter-passcode">
                <div className="modal-overlay"/>
                {this.renderMode()}
            </div>
        );
    }
}
