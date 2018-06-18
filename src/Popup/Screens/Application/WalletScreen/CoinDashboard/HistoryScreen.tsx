import React from 'react';
import {connect} from 'react-redux';
import {map, chain} from 'lodash';
import ReactSVG from 'react-svg';
import numeral from 'numeral';
import moment from 'moment';
import classNames from 'classnames';
import {Wallet} from '@berrywallet/core';

import {Helper, Coins} from 'Core';
import {mapWalletCoinToProps} from 'Popup/Store/WalletCoinConnector';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import {Badge} from 'Popup/UI';
import {openModal} from 'Popup/Modals';

// @TODO Need implemenet Props and State interface
class HistoryScreen extends React.Component<any, any> {

    protected openTransaction(transaction) {
        const {balance} = this.props;

        return (event) => {
            openModal('/transaction', {
                coin: this.props.coin.key,
                amount: Wallet.Helper.calculateTxBalance(balance, transaction.txid),
                txid: transaction.txid,
                tx: transaction
            });
        };
    }

    protected drawTransactionList() {
        const {walletData, balance} = this.props;

        const txsRows = chain(walletData.txs)
            .orderBy(['blockTime'], ['desc'])
            .map((tx, index) => {
                const rowProps = {
                    key: index,
                    className: "row tx-row",
                    onClick: this.openTransaction(tx)
                };

                const time = tx.blockTime ? tx.blockTime : tx.receiveTime;

                const amount = Wallet.Helper.calculateTxBalance(balance, tx.txid);
                const directionKey = amount > 0 ? Coins.TxDirection.Up : Coins.TxDirection.Down;
                const status = Helper.getTXStatus(tx);

                return <label {...rowProps}>
                    <ReactSVG
                        path={`/images/icons/arrow-${directionKey}.svg`}
                        className={classNames("tx-row__direction", `-${directionKey}`)}
                        wrapperClassName="tx-row__direction-wrapper"
                        style={{width: 7, height: 11}}
                    />
                    <div className="tx-row__amount">{numeral(amount).format('0,0.00[000000]')}</div>
                    <Badge status={status}/>
                    <div className="tx-row__time">{moment(time).format("MMM D, YYYY")}</div>
                </label>
            });

        return txsRows.value();
    }

    public render(): JSX.Element {
        const {coin} = this.props;
        return (
            <div>
                <TrackScreenView trackLabel={`wallet-${coin.getKey()}-history`}/>
                <div className="history-list">
                    {this.drawTransactionList()}
                </div>
            </div>
        )
    }
}


export const HistoryScreenComponent = connect(mapWalletCoinToProps)(HistoryScreen);