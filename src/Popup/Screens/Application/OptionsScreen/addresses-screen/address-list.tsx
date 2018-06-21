import React from 'react';
import {Coins} from 'Core'
import {map, orderBy} from 'lodash';
import {Wallet} from '@berrywallet/core';
import BigNumber from 'bignumber.js';
import {AddressRow, TAddressUnit} from "./address-row";

type TAddressListProps = {
    coinSymbol: Coins.CoinSymbol;
    wdProvider: Wallet.Provider.WDProvider;
};

export class AddressList extends React.Component<TAddressListProps> {

    protected fetchAddressUnits(): TAddressUnit[] {
        const addressBalances = this.props.wdProvider.address.getAddrBalances();

        const extractUnits = (balance: Wallet.Entity.Balance, address: string) => {
            const addrBalance: BigNumber = balance.receive
                .minus(balance.spend)
                .minus(balance.unconfirmed);

            return {
                address: address,
                balance: addrBalance.toNumber()
            } as TAddressUnit;
        };

        const units: TAddressUnit[] = map(addressBalances, extractUnits);

        return orderBy(units, 'balance', 'desc');
    }

    public render(): JSX.Element {
        const {coinSymbol} = this.props;
        const coin = Coins.coinList[coinSymbol];

        return (
            <div className="currency-option-list">
                {map(this.fetchAddressUnits(), (unit: TAddressUnit) => (
                    <AddressRow coin={coin} addressUnit={unit} key={unit.address}/>
                ))}
            </div>
        )
    }
}
