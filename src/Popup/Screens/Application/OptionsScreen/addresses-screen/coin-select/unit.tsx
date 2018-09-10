import React from 'react';
import { Coins } from 'Core';
import { CoinIcon } from 'Popup/components/coin-icon';

type TCoinUnit = {
    coin: Coins.CoinInterface;
};

export const Unit = (props: TCoinUnit) => {
    const { coin } = props;

    return (
        <div className="coin-unit">
            <CoinIcon coin={coin.getKey()} size={20} className="coin-unit__icon" />
            <div className={`coin-unit-title text-${coin.getKey()}`}>
                {coin.getKey()} - {coin.getName()}
            </div>
        </div>
    );
};
