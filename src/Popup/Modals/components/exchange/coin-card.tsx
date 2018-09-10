import React from 'react';
import cn from 'classnames';
import BigNumber from 'bignumber.js';
import { Coins } from 'Core';
import { CoinIcon } from 'Popup/components/coin-icon';
import { ValueSnippet } from 'Popup/UI';

type ExchangeCoinCardProps = {
    coin: Coins.CoinInterface;
    ticker: Coins.TickerData;
    value: BigNumber;
    isRight: boolean;
    label: string;
    fiat: Coins.FiatData;
};

export const CoinCard = (props: ExchangeCoinCardProps): JSX.Element => {
    const { coin, ticker, value, isRight, label, fiat } = props;
    return (
        <div className="stack-card modal-exchange-info__card">
            <div className={cn('modal-exchange-info__card-coin', isRight && '-right', 'text-' + coin.getKey())}>
                <CoinIcon coin={coin.getKey()} size={20} /> {coin.getName()}
            </div>

            <ValueSnippet
                label={label}
                coin={coin}
                ticker={ticker}
                value={value}
                fiat={fiat}
                className="modal-exchange-info__card-total"
                isRight={isRight}
                isLeft={!isRight}
            />
        </div>
    );
};
