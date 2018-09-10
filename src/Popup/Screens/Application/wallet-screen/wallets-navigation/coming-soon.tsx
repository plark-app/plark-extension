import React from 'react';
import { map } from 'lodash';
import { CoinSymbol } from 'Core/Coins';
import { CoinIcon } from 'Popup/components/coin-icon';

import './coming-soon.scss';

const coinsToRender = [
    CoinSymbol.BitcoinCash,
    CoinSymbol.Ripple,
    CoinSymbol.Neo,
    CoinSymbol.Monero,
];

export const ComingSoon = (): JSX.Element => {
    return (
        <div className="coming-soon">
            <div className="coming-soon__currencies">
                {map(coinsToRender, (coin: CoinSymbol) => (
                    <CoinIcon key={coin} coin={coin} size={16} />
                ))}
            </div>
            <div className="coming-soon__label">New currencies coming soon!</div>
        </div>
    );
};
