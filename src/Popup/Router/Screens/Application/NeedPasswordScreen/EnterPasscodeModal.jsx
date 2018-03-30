import React from 'react';

import TypePasscode from './TypePasscode';
import ForgotPasscode from './ForgotPasscode';
import {showAlert, closeAlert} from 'Popup/Router/Alert';


const PasswordMode = {
    Type: 'TYPE',
    Forgot: 'FORGOT'
};

export default class EnterPasscodeModal extends React.Component {

    state = {
        mode: PasswordMode.Type,
        hasError: false
    };

    componentWillUnmount() {
        closeAlert();
    }

    onError = (errorMessage) => {
        showAlert({
            message: errorMessage,
            onClose: this.onCloseError,
            noBody: true
        });

        this.setState(() => {
            return {
                hasError: true
            };
        });
    };

    onCloseError = (event) => {
        this.setState(() => {
            return {
                hasError: false
            };
        });
    };

    onSetScreenMode = (mode) => {
        return (event) => {
            this.setState(() => {
                return {
                    mode: mode,
                    hasError: false
                };
            })
        }
    };

    renderMode() {
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
