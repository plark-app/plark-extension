import React from 'react';
import BigNumber from 'bignumber.js';
import {Helper, Coins} from "Core";
import classNames from "classnames";
import './value-snippet.scss'

interface IValueSnippetProps {
    label?: string;
    coin: Coins.CoinInterface;
    ticker: Coins.TickerInterface;
    fiat: Coins.FiatInterface;
    value: BigNumber;
    isRight?: boolean;
    isLeft?: boolean;
    className?: string;
}

export class ValueSnippet extends React.Component<IValueSnippetProps, any> {
    render() {

        const {label, value, coin, fiat, ticker, isRight, isLeft, className} = this.props;

        return (
            <div className={classNames('value-snippet', isRight && '-right', isLeft && '-left', className)}>
                {label && <h3 className="value-snippet__title">{label}</h3>}
                <div className="value-snippet__coin">
                    {value.greaterThan(0) ? Helper.renderCoin(value) : 0} {coin.getKey()}
                </div>
                <div className="value-snippet__fiat">
                    {fiat.prefix}{Helper.renderFiat(value.greaterThan(0) ? value.mul(ticker.priceFiat) : 0)}
                </div>
            </div>
        )
    }
}