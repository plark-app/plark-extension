import React from 'react';
import {Wallet} from '@berrywallet/core';
import BigNumber from 'bignumber.js';
import {Coins} from 'Core'

type TAddressRowProps = {
    coin: Coins.CoinInterface;
    address: string;
    balance: Wallet.Entity.Balance;
};

export const AddressRow = (props: TAddressRowProps): JSX.Element => {

    const coinBalance: BigNumber = props.balance.receive
        .minus(props.balance.spend)
        .minus(props.balance.unconfirmed);

    return (
        <label className="row">
            {props.address} | {coinBalance.toFixed(8)} {props.coin.getKey()}
        </label>
    )
};