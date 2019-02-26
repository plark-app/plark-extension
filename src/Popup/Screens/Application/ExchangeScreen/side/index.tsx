import React from 'react';
import { compose } from 'recompose';
import BigNumber from 'bignumber.js';
import { Coins, Helper } from 'Core';
import { withCurrentFiat, WithCurrentFiatProps } from 'Popup/contexts/current-fiat';
import { ValueSnippet } from 'Popup/UI';
import { CoinSelect } from '../coin-select';
import { UnitInput } from './unit-input';

import './side.scss';

export enum InputTypes {
    Coin = 'COIN',
    Fiat = 'FIAT'
}

type SideState = {
    value: string;
    masterInput?: InputTypes;
}

class CoinSideComp extends React.Component<CoinSideProps, SideState> {

    public state: SideState = {
        value: '',
        masterInput: null,
    };

    public componentDidUpdate(oldProps: CoinSideProps): void {
        if (oldProps.ticker.key !== this.props.ticker.key && this.props.isMaster) {
            this.setRootValue(this.state.masterInput, this.state.value);
        }
    }

    public render(): JSX.Element {
        const { fromCoin, toCoin, isFrom, label, resultLabel, currentFiat, isMaster } = this.props;
        const { value, masterInput } = this.state;

        const rootCoinValue = this.coinValue;
        const currentCoin = this.coin.getKey();
        const currentTicker = this.ticker;

        return (
            <div className="exchange-side">
                <h2 className="exchange-side__head">{label}</h2>
                <CoinSelect fromCoin={fromCoin} toCoin={toCoin} isFrom={isFrom} />
                <div className="exchange-side__content">
                    <div className="split-case">
                        <UnitInput
                            rootCoinValue={rootCoinValue}
                            isMaster={isMaster}
                            isMasterInput={masterInput === InputTypes.Coin}
                            onChange={this.generateChangeInputEvent(InputTypes.Coin)}
                            symbolLabel={currentCoin}
                            value={value}
                            isCoin={true}
                            ticker={currentTicker}
                        />

                        <div className="split-case-separator" />

                        <UnitInput
                            rootCoinValue={rootCoinValue}
                            isMaster={isMaster}
                            isMasterInput={masterInput === InputTypes.Fiat}
                            onChange={this.generateChangeInputEvent(InputTypes.Fiat)}
                            symbolLabel={currentFiat.key}
                            value={value}
                            isCoin={false}
                            ticker={currentTicker}
                        />
                    </div>

                    <ValueSnippet
                        label={resultLabel}
                        coin={this.coin}
                        ticker={currentTicker}
                        value={rootCoinValue}
                        fiat={currentFiat.fiat}
                        className="exchange-total"
                        isRight={!isFrom}
                        isLeft={isFrom}
                    />
                </div>
            </div>
        );
    }

    protected get coin(): Coins.CoinInterface {
        return this.props.isFrom ? this.props.fromCoin : this.props.toCoin;
    }

    protected get ticker(): Coins.TickerData {
        return this.props.currentFiat.getTicker(this.coin.getKey());
    }

    protected get coinValue(): BigNumber {
        let resultValue: BigNumber = new BigNumber(0);

        const { value, isMaster } = this.props;
        const ticker = this.ticker;

        const { masterInput } = this.state;

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

        resultValue = resultValue.decimalPlaces(8);

        return resultValue;
    }

    protected setRootValue(inputType: InputTypes, value: string) {
        const { onSetValue } = this.props;

        let numValue = Helper.parseStrToBigN(value);

        if (inputType === InputTypes.Fiat) {
            const ticker = this.ticker;
            numValue = numValue.div(ticker.priceFiat);
        }

        numValue = numValue.decimalPlaces(8);
        onSetValue && onSetValue(numValue);
    }

    protected generateChangeInputEvent = (inputType: InputTypes) => {
        return (event) => {
            const value = event.target.value;
            this.setRootValue(inputType, value);

            this.setState(() => {
                return {
                    masterInput: inputType,
                    value: value,
                };
            });
        };
    };
}


export type CoinSideOwnProps = {
    fromCoin: Coins.CoinInterface;
    toCoin: Coins.CoinInterface;

    ticker: Coins.TickerData;

    isReady: boolean;

    isFrom: boolean;
    label: string;
    resultLabel: string;

    value?: BigNumber;
    isMaster: boolean;

    onSetValue: (value: BigNumber) => void;
};

type CoinSideProps = CoinSideOwnProps & WithCurrentFiatProps;

export const CoinSide = compose<CoinSideProps, CoinSideOwnProps>(withCurrentFiat)(CoinSideComp);
