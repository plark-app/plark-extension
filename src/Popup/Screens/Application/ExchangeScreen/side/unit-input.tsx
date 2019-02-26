import React from 'react';
import BigNumber from 'bignumber.js';
import { Helper, Coins } from 'Core';

type UnitInputProps = {
    rootCoinValue: BigNumber;
    isMaster: boolean;
    isMasterInput: boolean;
    onChange: any;
    symbolLabel: string;
    value: string;
    isCoin: boolean;
    ticker: Coins.TickerData;
};

export class UnitInput extends React.Component<UnitInputProps> {

    public get dummy(): JSX.Element | undefined {
        const {
            rootCoinValue,
            isMaster,
            isMasterInput,
            isCoin,
            ticker,
        } = this.props;

        if (rootCoinValue.isLessThanOrEqualTo(0) || (isMaster && isMasterInput)) {
            return;
        }

        return (
            <span className="split-case__input-dummy">
                {isCoin ? Helper.renderCoin(rootCoinValue) : Helper.renderFiat(rootCoinValue.times(ticker.priceFiat))}
            </span>
        );
    }

    public get placeholder(): string | undefined {
        const { rootCoinValue } = this.props;

        if (rootCoinValue.isGreaterThan(0)) {
            return;
        }

        return '0.00';
    }

    public render(): JSX.Element {
        const {
            isMaster,
            isMasterInput,
            onChange,
            symbolLabel,
            value,
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
        );
    }
}
