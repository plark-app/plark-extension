import React from 'react';
import cn from 'classnames';
import { map, Dictionary } from 'lodash';
import { AddWalletCard } from './add-wallet-card';
import { ComingSoon } from './coming-soon';
import { WalletItem } from './wallet-item';
import { Coins } from 'Core';

type CoinsNavProps = {
    activeCoin: Coins.CoinInterface;
    coinList: Dictionary<Coins.CoinInterface>;
    mindAddNew: boolean;
};

type CoinsNavState = {
    loaded: boolean;
};

export class WalletsNavigation extends React.PureComponent<CoinsNavProps, CoinsNavState> {
    public state: CoinsNavState = {
        loaded: false,
    };

    public componentDidMount(): void {
        setTimeout(() => this.setState({ loaded: true }), 0);
    };

    protected drawCoins = (): JSX.Element[] => {
        const { coinList, activeCoin } = this.props;

        return map(coinList, (coin) => (
            <WalletItem
                key={coin.getKey()}
                coin={coin}
                isActive={activeCoin && activeCoin.getKey() === coin.getKey()}
            />
        ));
    };

    public render(): JSX.Element {
        return (
            <div className="dashboard-coins">
                <div className={cn('dashboard-coins__wrapper', { '-loaded': this.state.loaded })}>
                    <div className="dashboard-coins__container">
                        {this.drawCoins()}
                        {this.props.mindAddNew && <AddWalletCard />}

                        <ComingSoon />
                    </div>
                </div>
            </div>
        );
    }
}
