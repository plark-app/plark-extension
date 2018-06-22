import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import {parse as parceUrl} from 'url';
import classNames from 'classnames';
import ReactSVG from 'react-svg';

import {Wallet} from "@berrywallet/core";
import {Helper} from 'Core';
import {copyToClipboard} from "Core/Utils";
import {CoinInterface, findCoin, TxDirection} from 'Core/Coins';
import {IStore} from 'Core/Declarations/Store';
import {RemoteLink, Notice, Badge} from 'Popup/UI';
import {DotLoader, Button} from 'Popup/UI';

import {ModalLayout} from "../ModalLayout";


interface IStoreProps {
    coin?: CoinInterface;
    blockHeight: number;
}

interface IOwnProps {
    tx: Wallet.Entity.WalletTransaction;
    txid: string;
    amount: number;
}

type ITransactionProps = IStoreProps & IOwnProps & React.HTMLProps<{}>;

interface IState {
    copied: boolean;
}

const mapStateToProps = (store: IStore, ownProps): IStoreProps => {
    return {
        coin: findCoin(ownProps.coin),
        blockHeight: store.Coin.blockHeights[ownProps.coin] || 0
    };
};

class TransactionComponent extends React.Component<ITransactionProps> {

    protected txidHiddenTextarea: HTMLInputElement;

    public state: IState = {
        copied: false
    };

    protected copyToClipboard = () => {
        copyToClipboard(this.txidHiddenTextarea).then(() => {
            this.setState({copied: true});

            setTimeout(() => {
                this.setState({copied: false});
            }, 2000);
        });
    };

    protected get fromAddress(): string | null {
        const {tx, amount} = this.props;
        if (amount < 0) {
            return null;
        }

        return tx['from'] || null;
    };

    protected get toAddress(): string | null {
        const {tx} = this.props;

        return tx['to'] || null;
    };

    public render(): JSX.Element {
        const {coin, tx, amount, blockHeight} = this.props;

        const shortTx = tx.txid.substr(0, 20) + '...' + tx.txid.substr(tx.txid.length - 14);
        const blockExplorerHost = parceUrl(coin.getExplorerHost()).host;
        const directionKey = amount > 0 ? TxDirection.Up : TxDirection.Down;

        const fromAddress = this.fromAddress;
        const toAddress = this.toAddress;

        const time = tx.blockTime ? tx.blockTime : tx.receiveTime;

        return (<ModalLayout>
            <div className="tx-popup">
                <ReactSVG
                    path={`/images/icons/arrow-${directionKey}.svg`}
                    className={classNames("tx-popup__direction", `-${directionKey}`)}
                    wrapperClassName={classNames("tx-popup__direction-wrapper", `-${directionKey}`)}
                    style={{width: 6, height: 10}}
                />

                <h1 className="tx-popup__title">{coin.getName()} Transaction</h1>
                <span className="tx-popup__subtitle">
                    {moment(time).format("MMM D, YYYY")}
                </span>

                <div className="tx-popup-card stack-card">
                    <Notice className='tx-info-copied' show={this.state.copied}>TXID copied!</Notice>

                    <dl className="tx-info-item">
                        <dt className="tx-info-item__title">Amount</dt>
                        <dd className="tx-info-item__value">{Helper.renderCoin(amount)} {coin.getKey()}</dd>
                    </dl>

                    <dl className="tx-info-item">
                        <dt className="tx-info-item__title">TXID</dt>
                        <dd className="tx-info-item__value -txid">
                            {shortTx}
                            <div className="tx-info-copy-txid">
                                <Button
                                    onClick={this.copyToClipboard}
                                    className="tx-info-copy-txid__btn"
                                    isOutline
                                >Copy TXID</Button>

                                <input type="text"
                                       style={{position: 'absolute', left: '-9999px'}}
                                       value={tx.txid}
                                       readOnly={true}
                                       ref={(elem: HTMLInputElement) => this.txidHiddenTextarea = elem}
                                />
                            </div>
                        </dd>
                    </dl>

                    {fromAddress && (
                        <dl className="tx-info-item">
                            <dt className="tx-info-item__title">From Address</dt>
                            <dd className="tx-info-item__value">
                                <RemoteLink className="text-link" to={coin.generateAddrLink(fromAddress)}>
                                    {fromAddress}
                                </RemoteLink>
                            </dd>
                        </dl>
                    )}

                    {toAddress && (
                        <dl className="tx-info-item">
                            <dt className="tx-info-item__title">To Address</dt>
                            <dd className="tx-info-item__value">
                                <RemoteLink className="text-link" to={coin.generateAddrLink(toAddress)}>
                                    {toAddress}
                                </RemoteLink>
                            </dd>
                        </dl>
                    )}

                    <dl className="tx-info-item">
                        <dt className="tx-info-item__title">Confirmations</dt>
                        <dd className="tx-info-item__value">
                            <span className="tx-info-confirmations">{
                                blockHeight && tx.blockHeight
                                    ? numeral(blockHeight - tx.blockHeight + 1).format("0,0")
                                    : <DotLoader/>
                            }</span>
                            <Badge status={Helper.getTXStatus(tx)}/>
                        </dd>
                    </dl>

                    <dl className="tx-info-item">
                        <dt className="tx-info-item__title">Received Time</dt>
                        <dd className="tx-info-item__value">{moment(time).format("MMM D, YYYY | HH:mm:ss")}</dd>
                    </dl>

                    <dl className="tx-info-item">
                        <dt className="tx-info-item__title">Detailed info</dt>
                        <dd className="tx-info-item__value">
                            <RemoteLink className="text-link" to={coin.generateTxLink(tx.txid)}>
                                {blockExplorerHost}
                            </RemoteLink>
                        </dd>
                    </dl>
                </div>
            </div>
        </ModalLayout>);
    }
}

export const Transaction = connect(mapStateToProps)(TransactionComponent);
