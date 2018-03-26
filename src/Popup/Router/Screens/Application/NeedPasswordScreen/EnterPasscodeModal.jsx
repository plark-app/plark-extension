import React from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import TypePasscode from './TypePasscode';
import ForgotPasscode from './ForgotPasscode';
import ModalError from './ModalError';


const PasswordMode = {
    Type: 'TYPE',
    Forgot: 'FORGOT'
};

export default class EnterPasscodeModal extends React.Component {

    state = {
        mode: PasswordMode.Type,
        hasError: false,
        errorMessage: null
    };

    onError = (errorMessage) => {
        this.setState({
            hasError: true,
            errorMessage: errorMessage
        });
    };

    onCloseError = (event) => {
        this.setState({
            hasError: false,
            errorMessage: null
        });
    };

    onSetScreenMode = (mode) => {
        return (event) => {
            this.setState({
                mode: mode,
                hasError: false,
                errorMessage: null
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
        const {errorMessage = null, hasError = false} = this.state;

        const errorTransitionGroupProps = {
            transitionName: '-animation',
            transitionEnterTimeout: 400,
            transitionLeaveTimeout: 400,
            className: 'modal-error-wrapper'
        };

        return (
            <div className="modal enter-passcode">
                <div className="modal-overlay"/>
                <ReactCSSTransitionGroup {...errorTransitionGroupProps}>
                    {hasError ? <ModalError errorMessage={errorMessage} onCloseError={this.onCloseError}/> : null}
                </ReactCSSTransitionGroup>
                {this.renderMode()}
            </div>
        );
    }
}
