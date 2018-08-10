import React from 'react';
import cn from 'classnames';
import { Coins } from 'Core';
import { coinSvgs } from 'svg';

import './coin-icon.scss';

export type CoinIconProps = React.HTMLProps<{}> & {
    coin: Coins.CoinSymbol;
    size?: number;
};

export const CoinIcon = (props: CoinIconProps) => {
    const { coin, size = 32, className } = props;

    return React.createElement(coinSvgs[coin], {
        className: cn('coin-icon', `-${coin}`, className),
        style: { width: `${size}px`, height: `${size}px` },
    });
};
