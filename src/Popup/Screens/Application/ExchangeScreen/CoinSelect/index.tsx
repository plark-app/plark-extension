import React from 'react';
import {map, filter} from 'lodash';
import classNames from 'classnames';
import {Coins} from 'Core';
import screenHistory from 'Popup/ScreenAddressHistory';
import {DropArrow} from 'Popup/UI';

import {CoinUnitComponent} from "./CoinUnit";

import "./coin-select.scss";

export interface ICSelectState {
    open: boolean;
}

export interface ICSelectProps {
    isFrom: boolean;
    fromCoin: Coins.CoinInterface;
    toCoin: Coins.CoinInterface;
}

export class CoinSelect extends React.Component<ICSelectProps, ICSelectState> {

    public readonly state: ICSelectState = {
        open: false
    };

    protected getCoin(): Coins.CoinInterface {
        const {fromCoin, toCoin, isFrom} = this.props;

        return isFrom ? fromCoin : toCoin;
    }

    protected getSelectItems() {
        const coin = this.getCoin();

        return filter(Coins.getRealCoins(), cn => cn !== coin);
    }

    protected resolveChanging(cn: Coins.CoinInterface) {
        const {fromCoin, toCoin, isFrom} = this.props;

        this.closeCoinList();

        let newFrom = fromCoin;
        let newTo = toCoin;

        if ((isFrom && cn == newTo) || (!isFrom && cn == newFrom)) {
            newFrom = toCoin;
            newTo = fromCoin;
        } else {
            if (isFrom) {
                newFrom = cn;
            } else {
                newTo = cn;
            }
        }

        screenHistory.push(`/app/exchange/${newFrom.getKey()}/${newTo.getKey()}`);
    }

    protected onChangeCoin = (cn: Coins.CoinInterface) => {
        return () => this.resolveChanging(cn);
    };

    protected closeCoinList = () => {
        this.setState(() => ({open: false}));
        document.removeEventListener('click', this.closeCoinList);
    };

    protected openCoinList = () => {
        this.setState(() => ({open: true}));
        document.addEventListener('click', this.closeCoinList);
    };

    public render(): JSX.Element {
        const coin = this.getCoin();
        const {open} = this.state;

        return <div className={classNames("exch-select", open && "-open")}>
            <div className="exch-select__current" onClick={this.openCoinList}>
                <CoinUnitComponent coin={coin}/>
                <DropArrow active={open} wrapperClassName="exch-select__current-arrow"/>
            </div>
            <div className="exch-select__units">
                <div className="exch-select__units-wrapper">
                    {map(this.getSelectItems(), (cn: Coins.CoinInterface) => {
                        return (
                            <div className="exch-select__unit" key={cn.getKey()} onClick={this.onChangeCoin(cn)}>
                                <CoinUnitComponent coin={cn}/>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    }
}
