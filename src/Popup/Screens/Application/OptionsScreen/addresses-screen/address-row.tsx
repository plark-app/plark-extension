import React from 'react';
import Numeral from 'numeral';
import {Coins} from 'Core';

export type TAddressUnit = {
    balance: number;
    address: string;
}

type TAddressRowProps = {
    coin: Coins.CoinInterface;
    addressUnit: TAddressUnit;
}

export const AddressRow = (props: TAddressRowProps): JSX.Element => {

    const {address, balance} = props.addressUnit;

    const addressRender = address.substr(0, 14)
        + '...'
        + address.substr(address.length - 12);

    return (
        <label className="row address-row">
            <div className="address-row__address">{addressRender}</div>
            <div className="address-row__value">
                {Numeral(balance).format('0,0.00[0000]')} {props.coin.getKey()}
            </div>
        </label>
    );
};
