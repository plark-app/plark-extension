import React from 'react';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import {connect} from 'react-redux';
import {Coins, Helper} from 'Core';
import {IStore} from "Core/Declarations/Store";
import {Selector} from "Popup/Store";

import {CoinSelect} from "../CoinSelect";
import {UnitInput} from "./UnitInput";

import './side.scss';

export enum InputTypes {
    Coin = 'COIN',
    Fiat = 'FIAT'
}

export interface ISideOwnProps {
    fromCoin: Coins.CoinInterface;
    toCoin: Coins.CoinInterface;

    ticker: Coins.TickerInterface;

    isReady: boolean;

    isFrom: boolean;
    label: string;
    resultLabel: string;

    value?: BigNumber;
    isMaster: boolean;

    onSetValue: (value: BigNumber) => void;
}

interface ISideMountedProps {
    fiat: Coins.FiatInterface;
}

interface ISideState {
    value: string;
    masterInput?: InputTypes;
}

type CoinSidePropsType = ISideOwnProps & ISideMountedProps;

class CoinSide extends React.Component<CoinSidePropsType, any> {

    public state: ISideState = {
        value: '',
        masterInput: null
    };

    componentDidUpdate(oldProps: ISideOwnProps) {
        if (oldProps.ticker.key !== this.props.ticker.key && this.props.isMaster) {
            this.setRootValue(this.state.masterInput, this.state.value);
        }
    }

    get coin(): Coins.CoinInterface {
        return this.props.isFrom ? this.props.fromCoin : this.props.toCoin;
    }

    get coinValue(): BigNumber {
        let resultValue: BigNumber = new BigNumber(0);

        const {
            value,
            ticker,
            isMaster
        } = this.props;

        const {masterInput} = this.state;

        if (!masterInput || !isMaster) {
            return value ? value : resultValue;
        }

        resultValue = Helper.parseStrToBigN(this.state.value);

        switch (masterInput) {
            case InputTypes.Coin:
                break;

            case InputTypes.Fiat:
                resultValue = resultValue.div(ticker.priceFiat);
                break;
        }

        resultValue = resultValue.round(8);

        return resultValue;
    }

    setRootValue(inputType: InputTypes, value: string) {
        const {onSetValue, ticker} = this.props;

        let numValue = Helper.parseStrToBigN(value);
        numValue = (inputType === InputTypes.Coin) ? numValue : numValue.div(ticker.priceFiat);
        numValue = numValue.round(8);
        onSetValue && onSetValue(numValue);
    }

    generateChangeInputEvent = (inputType: InputTypes) => {
        return (event) => {
            const value = event.target.value;
            this.setRootValue(inputType, value);

            this.setState(() => {
                return {
                    masterInput: inputType,
                    value: value
                };
            })
        };
    };

    render() {
        const {fromCoin, toCoin, isFrom, label, resultLabel, fiat, isMaster, ticker, isReady} = this.props;
        const {value, masterInput} = this.state;

        const rootCoinValue = this.coinValue;

        return (
            <div className="exchange-side">
                <h2 className="exchange-side__head">{label}</h2>
                <CoinSelect fromCoin={fromCoin} toCoin={toCoin} isFrom={isFrom}/>
                <div className="exchange-side__content">
                    <div className="split-case">
                        <UnitInput
                            rootCoinValue={rootCoinValue}
                            isMaster={isMaster}
                            isMasterInput={masterInput === InputTypes.Coin}
                            onChange={this.generateChangeInputEvent(InputTypes.Coin)}
                            symbolLabel={this.coin.getKey()}
                            value={value}
                            isCoin={true}
                            ticker={ticker}
                        />

                        <div className="split-case-separator"/>

                        <UnitInput
                            rootCoinValue={rootCoinValue}
                            isMaster={isMaster}
                            isMasterInput={masterInput === InputTypes.Fiat}
                            onChange={this.generateChangeInputEvent(InputTypes.Fiat)}
                            symbolLabel={fiat.key}
                            value={value}
                            isCoin={false}
                            ticker={ticker}
                        />
                    </div>

                    <div className={classNames('exchange-total', isFrom && '-right')}>
                        <h3 className="exchange-total__title">{resultLabel}</h3>
                        <div className="exchange-total__coin">
                            {Helper.renderCoin(rootCoinValue)} {this.coin.getKey()}
                        </div>
                        <div className="exchange-total__fiat">
                            {fiat.prefix}{Helper.renderCoin(rootCoinValue.mul(ticker.priceFiat))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store: IStore, ownProps: ISideOwnProps): ISideMountedProps => {
    return {
        fiat: Selector.currentFiatSelector(store)
    };
};

export const CoinSideComponent = connect(mapStateToProps)(CoinSide);