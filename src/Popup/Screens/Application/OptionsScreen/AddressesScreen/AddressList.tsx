import React from 'react';
import {Coins} from 'Core'
import {Wallet} from "@berrywallet/core";

type TAddressListProps = {
    coin: Coins.CoinSymbol;
};

export const AddressList = (props: TAddressListProps): JSX.Element => {
    return (
        <div className="currency-option-list" />
    )
};