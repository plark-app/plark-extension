import React from 'react';
import { Helper } from 'Core';
import { Background } from 'Popup/Service';
import { KeyringEvent } from 'Core/Actions/Controller';
import { Button } from 'Popup/UI';

export class EnterSeedStep extends React.PureComponent<any, any> {

    public state = {
        seed: ''
    };

    public componentDidMount(): void {
        setTimeout(() => {
            (this.refs.seedTextarea as HTMLInputElement).focus();
        }, 50);
    }

    onTextareaChange = (event) => {
        const value = event.target.value.toLowerCase();

        this.setState(() => {
            return {seed: value};
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
            .then(this.onPreparedResponse)
            .catch(this.onPreparedError);
    };

    onPreparedResponse = (response) => {
        const {onSeedSuccess} = this.props;
        onSeedSuccess && onSeedSuccess(this.seedWordArray());
    };

    onPreparedError = (error) => {
        const {onError = null} = this.props;
        onError && onError(error.message);
    };

    public render(): JSX.Element {
        const textareaProps = {
            className: "mnemonic__textarea",
            placeholder: "Enter your backup phrase here",
            onChange: this.onTextareaChange,
            value: this.state.seed,
            ref: 'seedTextarea'
        };

        return (
            <React.Fragment>
                <div className="topic">
                    <h1 className="topic__title">Enter your backup phrase to reset passcode</h1>
                </div>
                <form onSubmit={this.onSendSeed}>
                    <div className="mnemonic"><textarea {...textareaProps} /></div>
                    <div className="center">
                        <Button disabled={!this.state.seed} type="submit">Reset passcode</Button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}
