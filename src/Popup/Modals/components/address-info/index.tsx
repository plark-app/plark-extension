import React from 'react';
import Numeral from 'numeral';
import {Coins} from 'Core';
import {ModalLayout} from "../../ModalLayout";
import {InfoCard} from './info-card';

import './address-info.scss';

type TAddressInfoProps = {
    coin: Coins.CoinInterface;
    address: string;
    privateKey: string;
    balance: number;
};

export class AddressInfo extends React.Component<TAddressInfoProps> {

    public render(): JSX.Element {
        const {coin, address, privateKey, balance} = this.props;

        return (
            <ModalLayout className="address-info">
                <h2 className="title">Detailed Address Information</h2>
                <p className="desc">{Numeral(balance).format('0,0.00[000000]')} {coin.getKey()}</p>

                <div className="address-info-wrapper">
                    <InfoCard title="Address" data={address}/>
                    <InfoCard title="Private Key" data={privateKey}/>
                </div>
            </ModalLayout>
        );
    }
}