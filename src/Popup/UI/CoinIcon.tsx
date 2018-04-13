import React from 'react';
import ReactSVG from 'react-svg';
import classNames from 'classnames';
import {Coins} from 'Core';
import './coin-icon.scss';

export interface ICoinIconComponent {
    coin: Coins.CoinSymbol;
    size?: number;
    className?: any;
    wrapperClassName?: any;
}

export class CoinIcon extends React.Component<ICoinIconComponent, any> {
    render() {
        const {coin, size = 32, className, wrapperClassName} = this.props;

        return (
            <ReactSVG
                path={`/images/coins/${coin}.svg`}
                className={classNames('coin-icon', '-' + coin, className)}
                wrapperClassName={classNames("coin-icon-wrapper", wrapperClassName)}
                style={{width: size, height: size}}
            />
        )
    }
}