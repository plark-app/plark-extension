import React from 'react';
import {reverse} from 'lodash';
import {Wallet} from '@berrywallet/core';
import BigNumber from 'bignumber.js';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Numeral from 'numeral';
import debounce from 'debounce';

import {Controller} from 'Core/Actions';
import {mapWalletCoinToProps} from 'Popup/Store/WalletCoinConnector';
import {Button} from "Popup/Router/UIComponents";
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import {Background} from 'Popup/Service';
import SendDataFooterRow from './SendDataFooterRow';

@connect(mapWalletCoinToProps)
export default class SendScreen extends React.Component {

    state = {
        fee: null,
        value: '',
        address: '',
        activeInput: null
    };

    onChangeTxValueDebounce;

    constructor(props) {
        super(props);

        this.onChangeTxValueDebounce = debounce(this.onChangeTxValue, 300);
    }

    getCoinValue() {
        const {activeInput, value = ''} = this.state;
        const {ticker} = this.props;

        let dataValue = new BigNumber(parseFloat(value.replace(',', '.')) || 0);
        dataValue = dataValue.round(8);

        switch (activeInput) {
            case 'fiat':
                return dataValue.div(ticker.priceFiat);

            case 'coin':
            default:
                return dataValue;
        }
    }

    onChangeAddress = (event) => {
        const addressValue = event.target.value;
        this.setState(() => {
            return {
                address: addressValue
            };
        });
    };

    onChangeValueInput = (type) => {
        return (event) => {
            const val = event.target.value;
            this.setState(() => {
                return {
                    value: val,
                    fee: null,
                    activeInput: val ? type : null
                };
            }, this.onChangeTxValueDebounce);
        }
    };

    onChangeTxValue = () => {
        const newTxRequestParams = {
            coinKey: this.props.coin.key,
            address: this.state.address,
            value: this.getCoinValue().toNumber()
        };

        const resolveFee = (res) => {
            if (!res) {
                return;
            }

            this.setState(() => {
                return {
                    fee: res.fee
                }
            });
        };

        Background
            .sendRequest(Controller.WalletEvent.CalculateFee, newTxRequestParams)
            .then(resolveFee);
    };

    onSendValue = (event) => {
        const newTxRequestParams = {
            coinKey: this.props.coin.key,
            address: this.state.address,
            value: this.getCoinValue().toNumber()
        };

        const onSuccess = (response) => {
            this.setState(() => {
                return {
                    address: '',
                    value: '',
                    activeInput: null
                };
            })
        };

        const onError = (error) => {
            console.log(error);
        };

        Background
            .sendRequest(Controller.WalletEvent.CreateTransaction, newTxRequestParams)
            .then(onSuccess)
            .catch(onError);
    };

    render() {
        const {
            coin,
            fiat,
            ticker,
            balance
        } = this.props;

        const {address, activeInput, value, fee} = this.state;

        const coinValue = this.getCoinValue().toNumber();
        const walletBalance = Wallet.Helper.calculateBalance(balance);
        const remaining = walletBalance - fee - coinValue;
        const disabledSend = !this.state.address || coinValue <= 0 || remaining < 0;

        const footerElements = [
            <SendDataFooterRow
                coin={coin}
                fiat={fiat}
                ticker={ticker}
                value={walletBalance}
                isError={coinValue > 0 && remaining < 0}
                label="Spendable balance"
                key='spendable-balance'
            />
        ];

        if (this.state.address || coinValue > 0) {
            footerElements.push(<SendDataFooterRow
                coin={coin}
                fiat={fiat}
                ticker={ticker}
                loading={!fee}
                value={remaining > 0 ? remaining : 0}
                label="Remaining Balance"
                key='balance'
            />);

            footerElements.push(<SendDataFooterRow
                coin={coin}
                fiat={fiat}
                loading={!fee}
                ticker={ticker}
                value={fee}
                label={`${coin.getName()} Network Fee`}
                key='fee'
            />);
        }


        return (
            <div className={classNames("wallet-wrapper", "send", {})}>
                <TrackScreenView trackLabel="wallet-send"/>

                <label>
                    <input type="text"
                           placeholder={`${coin.getName()} address`}
                           value={address}
                           className="input"
                           onChange={this.onChangeAddress}
                    />
                </label>

                <div className="send-values">
                    <label className="send-value">
                        <span className="send-value__dummy">
                            {activeInput === 'fiat' ? Numeral(coinValue).format('0,0.00[000000]') : null}
                        </span>
                        <input placeholder={activeInput ? '' : '0.00'}
                               value={activeInput === 'coin' ? value : ''}
                               onChange={this.onChangeValueInput('coin')}
                               className="input"
                        />
                        <span className="send-value__fiat-label">{coin.getKey()}</span>
                    </label>

                    <label className="send-value">
                        <span className="send-value__dummy">
                            {activeInput === 'coin' ? Numeral(coinValue * ticker.priceFiat).format('0,0.00') : null}
                        </span>
                        <input placeholder={activeInput ? '' : '0.00'}
                               value={activeInput === 'fiat' ? value : ''}
                               onChange={this.onChangeValueInput('fiat')}
                               className="input"
                        />
                        <span className="send-value__fiat-label">{fiat.key}</span>
                    </label>
                </div>
                <Button className="-full-size" disabled={disabledSend} onClick={this.onSendValue}>Send</Button>
                <div className="send-footer">{reverse(footerElements)}</div>
            </div>
        )
    }
}
