import React from 'react';
import Numeral from "numeral";
import classNames from 'classnames';
import {CoinInterface, FiatInterface, TickerInterface} from "Core/Coins/Interfaces";
import {DotLoader} from 'Popup/Router/UIComponents';

interface IState {
}

interface IProps {
    coin: CoinInterface;
    fiat: FiatInterface;
    ticker: TickerInterface;
    isError: boolean;
    value: number;
    label: string;
    loading: boolean;
}

export default class SendDataFooterRow extends React.PureComponent<IProps, IState> {
    renderValue() {
        const {coin, fiat, ticker, value, loading = false} = this.props;

        if (loading) {
            return <span className="send-footer-row__loading"><DotLoader /></span>;
        }

        return (
            <React.Fragment>
                <span className="send-footer-row__value-coin">
                    {Numeral(value).format('0,0.00[000000]')} {coin.getKey()}
                </span>
                <b className="send-footer-row__value-fiat">
                    {fiat.prefix}{Numeral(value * ticker.priceFiat).format('0,0.00')}
                </b>
            </React.Fragment>
        )
    }

    render(): JSX.Element {
        const {
            label = '',
            isError = false
        } = this.props;

        return (
            <div className={classNames("send-footer-row", isError && '-error')}>
                <div className="send-footer-row__label">{label}</div>
                <div className="send-footer-row__value">{this.renderValue()}</div>
            </div>
        )
    }
}
