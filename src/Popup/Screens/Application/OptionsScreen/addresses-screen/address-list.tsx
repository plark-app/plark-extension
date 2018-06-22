import React from 'react';
import {Coins} from 'Core'
import {map, orderBy} from 'lodash';
import {Wallet} from '@berrywallet/core';
import BigNumber from 'bignumber.js';

import {Controller} from 'Core/Actions';
import {Background} from 'Popup/Service';
import {openModal} from 'Popup/Modals';

import {AddressRow, TAddressUnit} from './address-row';

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

    protected openAddressModal(unit: TAddressUnit) {
        const {wdProvider, coinSymbol} = this.props;

        const coin: Coins.CoinInterface = Coins.coinList[coinSymbol];
        const walletAddress = wdProvider.address.get(unit.address);

        Background
            .sendRequest(Controller.WalletEvent.GetPrivateKey, {
                coin: coin.getKey(),
                walletAddress: walletAddress
            })
            .then((privateKey: any) => {
                openModal('/address-info', {
                    coin: coin,
                    address: unit.address,
                    privateKey: privateKey,
                    balance: unit.balance
                });
            });
    }

    protected openAddressInfo = (unit: TAddressUnit) => {
        return () => this.openAddressModal(unit);
    };

    public render(): JSX.Element {
        const {coinSymbol} = this.props;
        const coin = Coins.coinList[coinSymbol];

        return (
            <div className="currency-option-list">
                {map(this.fetchAddressUnits(), (unit: TAddressUnit) => (
                    <AddressRow key={unit.address}
                                coin={coin}
                                addressUnit={unit}
                                onClick={this.openAddressInfo(unit)}
                    />
                ))}
            </div>
        )
    }
}
