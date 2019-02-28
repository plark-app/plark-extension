import React from 'react';
import { Helper } from 'Core';
import { Background } from 'Popup/Service';
import { KeyringEvent } from 'Core/Actions/Controller';
import { Button } from 'Popup/UI';

export default class EnterSeedStep extends React.PureComponent<any, any> {

    public state = {
        seed: '',
    };

    public componentDidMount(): void {
        setTimeout(() => {
            (this.refs.seedTextarea as HTMLInputElement).focus();
        }, 50);
    }

    protected onTextareaChange = (event) => {
        const value = event.target.value.toLowerCase();

        this.setState(() => {
            return { seed: value };
        });
    };

    protected seedWordArray = () => {
        return Helper.normalizeSeed(this.state.seed).split(' ');
    };

    protected onSendSeed = async (event) => {
        event.preventDefault();
        const seedWords = this.seedWordArray();

        const { onSeedSuccess, onError = null } = this.props;

        try {
            await Background.sendRequest(KeyringEvent.CheckSeed, { seed: seedWords });
            onSeedSuccess && onSeedSuccess(this.seedWordArray());
        } catch (error) {
            onError && onError(error.message);
        }
    };

    public render(): JSX.Element {
        const textareaProps = {
            className: "mnemonic__textarea",
            placeholder: "Enter your backup phrase here",
            onChange: this.onTextareaChange,
            value: this.state.seed,
            ref: 'seedTextarea',
        };

        return (
            <>
                <div className="topic">
                    <h1 className="topic__title">Enter your backup phrase to reset passcode</h1>
                </div>
                <form onSubmit={this.onSendSeed}>
                    <div className="mnemonic"><textarea {...textareaProps} /></div>
                    <div className="center">
                        <Button disabled={!this.state.seed} type="submit">Reset passcode</Button>
                    </div>
                </form>
            </>
        );
    }
}
