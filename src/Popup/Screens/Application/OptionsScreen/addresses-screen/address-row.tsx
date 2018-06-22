import React from 'react';
import cn from 'classnames';
import Numeral from 'numeral';
import {Coins} from 'Core';

export type TAddressUnit = {
    balance: number;
    address: string;
}

type TAddressRowProps = {
    coin: Coins.CoinInterface;
    addressUnit: TAddressUnit;
    onClick?: () => void;
}

export const AddressRow = (props: TAddressRowProps): JSX.Element => {

    const {address, balance} = props.addressUnit;

    const addressRender = address.substr(0, 14)
        + '...'
        + address.substr(address.length - 12);

    const balanceClass = cn("address-row__value", {
        '-is-empty': balance === 0
    });

    return (
        <label className="row address-row" onClick={props.onClick}>
            <div className="address-row__address">{addressRender}</div>
            <div className={balanceClass}>
                {Numeral(balance).format('0,0.00[0000]')} {props.coin.getKey()}
            </div>
        </label>
    );
};
