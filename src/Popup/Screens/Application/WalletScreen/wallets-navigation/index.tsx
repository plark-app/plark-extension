import React from 'react';
import classNames from 'classnames';
import {map, Dictionary} from 'lodash';
import {AddWalletCard} from './add-wallet-card';
import {ComingSoon} from './coming-soon';
import {WalletItem} from './wallet-item';
import {Coins} from "Core";

interface ICoinsNavProps {
    activeCoin: Coins.CoinInterface;
    coinList: Dictionary<Coins.CoinInterface>;
    mindAddNew: boolean;
}

interface ICoinsNavState {
    loaded: boolean;
}

export class WalletsNavigation extends React.PureComponent<ICoinsNavProps, ICoinsNavState> {
    public state: ICoinsNavState = {
        loaded: false
    };

    public componentDidMount(): void {
        setTimeout(() => this.setState({loaded: true}), 0);
    };

    protected drawCoins = (): JSX.Element[] => {
        const {coinList, activeCoin} = this.props;

        return map(coinList, (coin) => (
            <WalletItem key={coin.getKey()}
                        coin={coin}
                        isActive={activeCoin && activeCoin.getKey() === coin.getKey()}
            />
        ))
    };

    render() {
        return (
            <div className="dashboard-coins">
                <div className={classNames("dashboard-coins__wrapper", {'-loaded': this.state.loaded})}>
                    <div className="dashboard-coins__container">
                        {this.drawCoins()}
                        {this.props.mindAddNew && <AddWalletCard/>}

                        <ComingSoon/>
                    </div>
                </div>
            </div>
        )
    }
}
