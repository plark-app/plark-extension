import React from 'react';
import { map, size } from 'lodash';
import cn from 'classnames';
import { Coins } from 'Core';
import { ICoinWallet } from 'Core/Declarations/Wallet';
import { IWalletStore } from 'Core/Declarations/Store';
import { DropArrow } from 'Popup/UI';
import { Unit } from "./unit";

import './coin-select.scss';


type TCoinSelectProps = {
    activeSymbol: Coins.CoinSymbol;
    coins: Coins.CoinSymbol[];
    wallets: IWalletStore;
    onSelectCoin: (symbol: string) => void;
};

type TCoinSelectState = {
    isOpen: boolean;
};

export class CoinSelect extends React.PureComponent<TCoinSelectProps, TCoinSelectState> {

    public readonly state: TCoinSelectState = {
        isOpen: false,
    };

    public componentWillUnmount() {
        window.removeEventListener('click', this.closeSelect);
    }

    protected setActiveCoin = (symbol: Coins.CoinSymbol) => {
        return () => {
            this.props.onSelectCoin(symbol);
        };
    };

    protected openSelect = () => {
        this.setState({ isOpen: true });

        document.addEventListener('click', this.closeSelect);
    };

    protected closeSelect = () => {
        this.setState({ isOpen: false });

        document.removeEventListener('click', this.closeSelect);
    };

    protected renderCoinSelect = (symbol: Coins.CoinSymbol) => {
        const coin = Coins.coinList[symbol];

        const wallet: ICoinWallet = this.props.wallets[symbol];
        const { walletData } = wallet;

        let txCount = 0;
        if (walletData) {
            txCount = size(walletData.txs);
        }

        return (
            <div className="coin-select__unit" key={symbol} onClick={walletData ? this.setActiveCoin(symbol) : null}>
                <Unit coin={coin} />
                <div className="coin-select__unit-txcount">{txCount} Transactions</div>
            </div>
        );
    };

    public render(): JSX.Element {
        const activeCoin: Coins.CoinInterface = Coins.coinList[this.props.activeSymbol];

        return (
            <div className={cn("coin-select", this.state.isOpen && '-is-open')}>
                <div className="coin-select__current" onClick={this.openSelect}>
                    <Unit coin={activeCoin} />
                    <DropArrow active={this.state.isOpen} />
                </div>
                <div className="coin-select-units">
                    <div className="coin-select-units-wrapper">
                        {map(this.props.coins, this.renderCoinSelect)}
                    </div>
                </div>
            </div>
        );
    }
}