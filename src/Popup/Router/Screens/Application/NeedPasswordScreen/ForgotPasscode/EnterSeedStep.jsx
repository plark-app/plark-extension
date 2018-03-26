import React from 'react';
import {Helper} from 'Core';
import {Background} from 'Popup/Service';
import {KeyringEvent} from 'Core/Actions/Controller';
import {Button} from 'Popup/Router/UIComponents';




export default class EnterSeedStep extends React.Component {

    state = {
        seed: ''
    };

    componentDidMount() {
        setTimeout(() => {
            this.refs.seedTextarea.focus();
        }, 50);
    }

    onTextareaChange = (event) => {
        this.setState(() => {
            return {
                seed: event.target.value.toLowerCase()
            };
        });
    };

    seedWordArray = () => {
        return Helper.normalizeSeed(this.state.seed).split(' ');
    };

    onSendSeed = (event) => {
        event.preventDefault();
        const seedWords = this.seedWordArray();

        Background
            .sendRequest(KeyringEvent.CheckSeed, {seed: seedWords})
            .then(this.onPreparedResponse);
    };

    onPreparedResponse = (response) => {
        const {onError, onSeedSuccess} = this.props;

        if (response.success) {
            onSeedSuccess && onSeedSuccess(this.seedWordArray());

            return;
        }

        onError && onError("Oh snap! Wrong Backup Phrase. Please try again.");
    };

    render() {
        const textareaProps = {
            className: "mnemonic__textarea",
            placeholder: "Enter your backup phrase here",
            onChange: this.onTextareaChange,
            value: this.state.seed,
            ref: 'seedTextarea'
        };

        return (
            <div>
                <div className="topic">
                    <h1 className="topic__title">Enter your backup phrase to reset passcode</h1>
                </div>
                <form onSubmit={this.onSendSeed}>
                    <div className="mnemonic"><textarea {...textareaProps}/></div>
                    <div className="center">
                        <Button disabled={!this.state.seed}>Reset passcode</Button>
                    </div>
                </form>
            </div>
        );
    }
}
