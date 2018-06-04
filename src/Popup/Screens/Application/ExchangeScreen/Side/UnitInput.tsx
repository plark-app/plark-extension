import React from 'react';
import BigNumber from 'bignumber.js';
import {Helper, Coins} from "Core";

interface IUnitInputProps {
    rootCoinValue: BigNumber;
    isMaster: boolean;
    isMasterInput: boolean;
    onChange: any;
    symbolLabel: string;
    value: string;
    isCoin: boolean;
    ticker: Coins.TickerInterface;
}

export class UnitInput extends React.Component<IUnitInputProps, any> {

    get dummy() {
        const {
            rootCoinValue,
            isMaster,
            isMasterInput,
            isCoin,
            ticker
        } = this.props;

        if (rootCoinValue.lessThanOrEqualTo(0) || (isMaster && isMasterInput)) {
            return null;
        }

        return (
            <span className="split-case__input-dummy">
                {isCoin ? Helper.renderCoin(rootCoinValue) : Helper.renderFiat(rootCoinValue.mul(ticker.priceFiat))}
            </span>
        )
    }


    get placeholder() {
        const {rootCoinValue} = this.props;

        if (rootCoinValue.greaterThan(0)) {
            return null;
        }

        return '0.00';
    }

    render(): JSX.Element {
        const {
            isMaster,
            isMasterInput,
            onChange,
            symbolLabel,
            value
        } = this.props;

        return (
            <label className="split-case__input-wrapper">
                {this.dummy}
                <input className="split-case__input"
                       type="text"
                       placeholder={this.placeholder}
                       value={(isMaster && isMasterInput) ? value : ''}
                       onChange={onChange}
                />
                <span className="split-case__input-symbol">{symbolLabel}</span>
            </label>
        )
    }
}