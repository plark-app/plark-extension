import React from 'react';
import {Link} from 'react-router-dom';
import ReactSVG from 'react-svg';
import {Button} from 'Popup/UI';
import {KeyboardHandler} from 'Popup/SystemComponent';
import screenHistory from 'Popup/ScreenAddressHistory';
import {SEED_WORD_COUNT} from 'Core/Constant';

const SEED_WORD_START_POSITION = 1;

export default class PhrasePart extends React.Component {

    state = {
        currentIndex: SEED_WORD_START_POSITION
    };

    changeWordIndex(toChange) {
        return () => {
            const {currentIndex} = this.state;

            const nextIndex = currentIndex + toChange;

            if (nextIndex < SEED_WORD_START_POSITION || nextIndex > SEED_WORD_COUNT) {
                return;
            }

            this.setState(() => {
                return {
                    currentIndex: nextIndex
                };
            });
        }
    };

    onNextPart = () => {
        const {currentIndex} = this.state;

        if (currentIndex !== SEED_WORD_COUNT) {
            return;
        }

        screenHistory.push("/startup/create/check");
    };

    render() {
        const {seed} = this.props;
        const {currentIndex} = this.state;

        const seedWords = seed.split(' ');

        const buttonProps = {
            className: "startup-welcome-button",
            onClick: this.onNextPart,
            disabled: currentIndex !== SEED_WORD_COUNT
        };

        return (<div>
            <KeyboardHandler onPressEnter={this.onNextPart}
                             onPressLeft={this.changeWordIndex(-1)}
                             onPressRight={this.changeWordIndex(+1)}
            />

            <div className="topic">
                <h1 className="topic__title">Backup Phrase</h1>
                <p className="topic__desc">Please, write down each word in order on a piece of paper.</p>
            </div>

            <div className="phrase-list">
                <div className="phrase-list-stack">
                    <button
                        className="phrase-list-stack__button -prev"
                        onClick={this.changeWordIndex(-1)}
                        disabled={currentIndex === SEED_WORD_START_POSITION}
                    ><ReactSVG
                        path={`/images/icons/arrow-left.svg`}
                        wrapperClassName="phrase-list-stack__button-icon"
                        style={{width: 16, height: 10}}
                    /></button>

                    <div className="stack-card phrase-list-stack__card">{seedWords[currentIndex - 1]}</div>

                    <button
                        className="phrase-list-stack__button -next"
                        onClick={this.changeWordIndex(+1)}
                        disabled={currentIndex === SEED_WORD_COUNT}
                    ><ReactSVG
                        path={`/images/icons/arrow-right.svg`}
                        wrapperClassName="phrase-list-stack__button-icon"
                        style={{width: 16, height: 10}}
                    /></button>
                </div>

                <div className="phrase-list-numbers">
                    <b>{currentIndex}</b> of <b>{SEED_WORD_COUNT}</b>
                </div>
            </div>

            <Button {...buttonProps}>Next</Button>
        </div>);
    }
}