import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import {parse as parceUrl} from 'url';
import classNames from 'classnames';
import ReactSVG from 'react-svg';

import {Helper} from 'Core';
import {findCoin, TxDirection} from "Core/Coins";
import {Notice, Badge, RemoteLink} from "Popup/Service/UIComponents";
import {DotLoader} from 'Popup/Router/UIComponents';

import ModalLayout from "../ModalLayout";

const mapStateToProps = (store, ownProps) => {
    return {
        coin: findCoin(ownProps.coin),
        blockHeight: store.Coin.blockHeights[ownProps.coin] || 0
    };
};

@connect(mapStateToProps, null)
export default class Transaction extends React.Component {

    txidHiddenTextarea;
    state = {
        copied: false
    };

    copyToClipboard = () => {
        this.txidHiddenTextarea.select();
        try {
            let successful = document.execCommand('copy');
            // @TODO There is no way to keep it here.. Should be other way.
            if (successful) {
                this.setState(() => {
                    setTimeout(() => {
                        this.setState(() => {
                            return {copied: false}
                        });
                    }, 2000);

                    return {copied: true};
                });
            }
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    };

    getFromAddress = () => {
        const {tx, amount} = this.props;
        if (amount < 0) {
            return null;
        }

        return tx.from || null;
    };

    getToAddress = () => {
        const {tx, amount} = this.props;

        return tx.to || null;
    };

    render() {
        const {coin, tx, amount, blockHeight} = this.props;

        const shortTx = tx.txid.substr(0, 20) + '...' + tx.txid.substr(tx.txid.length - 14);
        const blockExplorerHost = parceUrl(coin.getExplorerHost()).host;
        const directionKey = amount > 0 ? TxDirection.Up : TxDirection.Down;

        const fromAddress = this.getFromAddress(directionKey);
        const toAddress = this.getToAddress(directionKey);

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
                <span className="tx-popup__subtitle">{moment(tx.time).format("MMM D, YYYY")}</span>

                <div className="tx-popup-card stack-card">
                    <Notice className='tx-info-copied' show={this.state.copied}>TXID copied!</Notice>

                    <dl className="tx-info-item">
                        <dt className="tx-info-item__title">Amount</dt>
                        <dd className="tx-info-item__value">{numeral(amount).format('0,0.00[000000]')} {coin.getKey()}</dd>
                    </dl>

                    <dl className="tx-info-item">
                        <dt className="tx-info-item__title">TXID</dt>
                        <dd className="tx-info-item__value -txid">
                            {shortTx}
                            <div className="tx-info-copy-txid">
                                <button
                                    onClick={this.copyToClipboard}
                                    className="tx-info-copy-txid__btn btn -outline"
                                >Copy TXID
                                </button>
                                <input
                                    type="text"
                                    style={{position: 'absolute', left: '-9999px'}}
                                    value={tx.txid}
                                    readOnly={true}
                                    ref={(elem) => this.txidHiddenTextarea = elem}
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
                            <span className="tx-info-confirmations">
                                {
                                    blockHeight && tx.blockHeight
                                        ? numeral(blockHeight - tx.blockHeight + 1).format("0,0")
                                        : <DotLoader/>
                                }
                            </span>
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