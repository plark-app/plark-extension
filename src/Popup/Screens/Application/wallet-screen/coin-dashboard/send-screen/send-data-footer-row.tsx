import React from 'react';
import BigNumber from 'bignumber.js';
import Numeral from 'numeral';
import cn from 'classnames';
import { CoinInterface, FiatData, TickerData } from 'Core/Coins/Interfaces';
import { DotLoader } from 'Popup/UI';

export type FooterRowProps = {
    key?: string;
    coin: CoinInterface;
    fiat: FiatData;
    ticker: TickerData;
    isError: boolean;
    value: BigNumber;
    label: string;
    loading: boolean;
};

export class SendDataFooterRow extends React.PureComponent<FooterRowProps> {

    public render(): JSX.Element {
        const { label = '', isError = false } = this.props;

        return (
            <div className={cn("send-footer-row", isError && '-error')}>
                <div className="send-footer-row__label">{label}</div>
                <div className="send-footer-row__value">{this.renderValue()}</div>
            </div>
        );
    }

    protected getValue(): BigNumber {
        let value = this.props.value;
        if (!(value instanceof BigNumber)) {
            return new BigNumber(value);
        }

        return value;
    }

    protected renderValue() {
        const { coin, fiat, ticker, loading = false } = this.props;
        if (loading) {
            return <span className="send-footer-row__loading"><DotLoader /></span>;
        }

        const value = this.getValue();

        return (
            <>
                <span className="send-footer-row__value-coin">
                    {Numeral(value).format('0,0.00[000000]')} {coin.getKey()}
                </span>
                <b className="send-footer-row__value-fiat">
                    {fiat.prefix}{Numeral(value.times(ticker.priceFiat)).format('0,0.00')}
                </b>
            </>
        );
    }
}
