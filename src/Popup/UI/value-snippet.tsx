import React from 'react';
import cn from 'classnames';
import BigNumber from 'bignumber.js';
import { Helper, Coins } from 'Core';

import './value-snippet.scss';

type ValueSnippetProps = {
    label?: string;
    coin: Coins.CoinInterface;
    ticker: Coins.TickerData;
    fiat: Coins.FiatData;
    value: BigNumber;
    isRight?: boolean;
    isLeft?: boolean;
    className?: string;
}

export const ValueSnippet = (props: ValueSnippetProps) => {
    const { label, value, coin, fiat, ticker, isRight, isLeft, className } = props;

    return (
        <div className={cn('value-snippet', isRight && '-right', isLeft && '-left', className)}>
            {label && <h3 className="value-snippet__title">{label}</h3>}
            <div className="value-snippet__coin">
                {value.isGreaterThan(0) ? Helper.renderCoin(value) : 0} {coin.getKey()}
            </div>
            <div className="value-snippet__fiat">
                {fiat.prefix}{Helper.renderFiat(value.isGreaterThan(0) ? value.times(ticker.priceFiat) : 0)}
            </div>
        </div>
    );
};
