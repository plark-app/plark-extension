import React from 'react';
import classNames from 'classnames';
import {coinSvgs} from 'svg';
import {Coins} from 'Core';

import './coin-icon.scss';

export interface ICoinIconProps extends React.HTMLProps<{}> {
    coin: Coins.CoinSymbol;
    size?: number;
}

export class CoinIcon extends React.Component<ICoinIconProps> {
    public render(): JSX.Element {
        const {coin, size = 32, className} = this.props;

        return React.createElement(coinSvgs[coin], {
            className: classNames('coin-icon', `-${coin}`, className),
            style: {width: `${size}px`, height: `${size}px`}
        });
    }
}
