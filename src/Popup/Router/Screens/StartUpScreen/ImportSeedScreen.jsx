import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Helper} from 'Core';
import proxyStore from 'Popup/Store';
import WelcomeLink from './Parts/WelcomeLink';
import WelcomeLayout from './Parts/WelcomeLayout';
import {mapWelcomeDispatchers} from 'Popup/Store/KeyringConnector';


import {SEED_WORD_COUNT} from 'Core/Constant';
import {Button} from "Popup/UI";

@connect(null, mapWelcomeDispatchers)
export default class ImportSeedScreen extends React.Component {

    state = {
        seed: '',
        errorSeed: null,
        correct: false
    };

    onTextareaChange = (event) => {
        let seed = event.target.value,
            error = null,
            correct = true;

        try {
            this.validateSeed(seed);
        } catch (exception) {
            error = exception.message;
            correct = false;
        }

        this.setState({
            seed: seed.toLowerCase(),
            errorSeed: error,
            correct: correct
        });
    };

    onNext = () => {
        let seed = Helper.normalizeSeed(this.state.seed);

        try {
            this.validateSeed(seed);
        } catch (error) {
            return false;
        }

        proxyStore.dispatch({
            type: 'WELCOME::SET_SEED',
            seed: seed
        });

        this.props.pushWelcomeLocation('/startup/passcode');
    };

    onBack = () => {
        proxyStore.dispatch({type: 'WELCOME::CLEAR_SEED'});
    };

    validateSeed = (seed) => {
        if (!seed) {
            throw Error(`Backup phrase is empty. Enter ${SEED_WORD_COUNT} words`)
        }

        const wordCount = Helper.normalizeSeed(seed).split(' ').length;

        if (wordCount !== SEED_WORD_COUNT) {
            throw Error(`Oh snap! Change a few things up and try submitting again.`)
        }
    };

    render() {
        const layoutProps = {
            className: "startup-import",
            trackLabel: "startup-import",
            topicTitle: "Import Your Backup Phrase",
            topicDescription: "Please enter your backup phrase so we can process it and create a wallet",
            onPressEnter: this.onNext
        };

        return (
            <WelcomeLayout {...layoutProps}>
                <div className="startup-wrapper">
                    <div className="mnemonic">
                        <textarea
                            className="mnemonic__textarea"
                            readOnly={false}
                            placeholder="Enter your backup phrase here"
                            onChange={this.onTextareaChange}
                            value={this.state.seed}
                        />
                        <label className={classNames("mnemonic-correct", {'-show': this.state.correct})}>
                            <img className="mnemonic-correct__tick" src="/images/icons/tick.svg"/> Correct!
                        </label>
                    </div>
                </div>

                <Button
                    className={classNames("btn", "startup-welcome-button")}
                    disabled={!this.state.seed || !!this.state.errorSeed}
                    onClick={this.onNext}
                >Proceed</Button>

                {
                    this.state.correct
                        ? (
                            <div className="startup-notice">
                                Store your written copy in a secure and safe location. You will have to <br/>
                                use this backup phrase should you ever need to restore your wallet.
                            </div>
                        ) : (
                            <WelcomeLink
                                to="/startup"
                                className="startup-back-link"
                                onClick={this.onBack}
                            >← Back to previous screen</WelcomeLink>
                        )
                }
            </WelcomeLayout>
        );
    }
}
