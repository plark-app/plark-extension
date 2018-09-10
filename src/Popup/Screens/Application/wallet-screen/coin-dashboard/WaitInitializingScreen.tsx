import React from 'react';
import {Notice} from 'svg';
import {CoinInterface} from "Core/Coins";

interface IProps {
    coin: CoinInterface;
}

export class WaitInitializingScreen extends React.PureComponent<IProps> {
    public render(): JSX.Element {
        const {coin} = this.props;

        return (
            <div className="wallet-initializing">
                <Notice className="wallet-initializing__notice"/>
                <div className="wallet-initializing__title">Initializing {coin.getName()} Wallet…</div>
                <p className="wallet-initializing__desc">
                    Please wait, your {coin.getName()} Wallet is being imported to BerryWallet.
                </p>
            </div>
        )
    }
}
