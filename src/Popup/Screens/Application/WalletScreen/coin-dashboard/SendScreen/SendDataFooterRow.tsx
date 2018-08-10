import React from 'react';
import BigNumber from 'bignumber.js';
import Numeral from "numeral";
import classNames from 'classnames';
import { CoinInterface, FiatInterface, TickerInterface } from "Core/Coins/Interfaces";
import { DotLoader } from 'Popup/UI';

export interface IFooterRowProps {
    key?: string;
    coin: CoinInterface;
    fiat: FiatInterface;
    ticker: TickerInterface;
    isError: boolean;
    value: BigNumber;
    label: string;
    loading: boolean;
}

export class SendDataFooterRow extends React.PureComponent<IFooterRowProps> {

    getValue(): BigNumber {
        let value = this.props.value;
        if (!(value instanceof BigNumber)) {
            return new BigNumber(value);
        }

        return value;
    }

    renderValue() {
        const { coin, fiat, ticker, loading = false } = this.props;
        if (loading) {
            return <span className="send-footer-row__loading"><DotLoader /></span>;
        }

        const value = this.getValue();

        return (
            <React.Fragment>
                <span className="send-footer-row__value-coin">
                    {Numeral(value).format('0,0.00[000000]')} {coin.getKey()}
                </span>
                <b className="send-footer-row__value-fiat">
                    {fiat.prefix}{Numeral(value.times(ticker.priceFiat)).format('0,0.00')}
                </b>
            </React.Fragment>
        );
    }

    render(): JSX.Element {
        const {
            label = '',
            isError = false,
        } = this.props;

        return (
            <div className={classNames("send-footer-row", isError && '-error')}>
                <div className="send-footer-row__label">{label}</div>
                <div className="send-footer-row__value">{this.renderValue()}</div>
            </div>
        );
    }
}
