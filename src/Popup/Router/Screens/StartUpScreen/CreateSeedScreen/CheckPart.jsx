import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {KeyboardHandler} from 'Popup/Router/SystemComponent';
import {mapWelcomeDispatchers} from "Popup/Store/KeyringConnector";
import {Button} from "Popup/Router/UIComponents";

@connect(null, mapWelcomeDispatchers)
export default class CheckPart extends React.Component {

    state = {
        inputSeed: '',
        correct: false
    };

    onTextareaChange = (event) => {
        const {seed} = this.props;

        const inputSeed = event.target.value,
            checkSeed = inputSeed.trim().toLowerCase();

        let correct = (seed === checkSeed);

        this.setState(() => {
            return {
                inputSeed: inputSeed,
                correct: correct
            };
        });
    };

    onNext = () => {
        if (!this.state.correct) {
            return false;
        }

        this.props.pushWelcomeLocation('/startup/passcode');
    };

    render() {
        const textareaProps = {
            readOnly: false,
            value: this.state.inputSeed,
            className: "mnemonic__textarea",
            onChange: this.onTextareaChange,
            placeholder: "Enter your backup phrase here"
        };

        const nextButtonProps = {
            className: "startup-welcome-button",
            disabled: !this.state.correct,
            onClick: this.onNext
        };

        return (<div>
            <KeyboardHandler onPressEnter={this.onNext}/>
            <div className="topic">
                <h1 className="topic__title">Confirm Your Backup Phrase</h1>
                <p className="topic__desc">Please enter your 12-word backup phrase</p>
            </div>

            <div className="mnemonic">
                <textarea {...textareaProps} />
                <label className={classNames("mnemonic-correct", {'-show': this.state.correct})}>
                    <img className="mnemonic-correct__tick" src="/images/icons/tick.svg"/> Correct!
                </label>
            </div>

            <Button {...nextButtonProps}>Proceed</Button>
        </div>);
    }
}