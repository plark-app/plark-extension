import React from 'react';
import {reverse, debounce} from 'lodash';
import BigNumber from 'bignumber.js';
import {connect} from 'react-redux';
import {Wallet, Coin} from '@berrywallet/core';
import classNames from 'classnames';
import Numeral from 'numeral';
import {Controller} from 'Core/Actions';
import {Button} from "Popup/UI";
import {mapWalletCoinToProps} from 'Popup/Store/WalletCoinConnector';
import {showAlert} from 'Popup/Router/Alert';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import {Background} from 'Popup/Service';
import {FooterComponent} from "./SendScreenComponents/FooterComponent";

@connect(mapWalletCoinToProps)
export default class SendScreen extends React.Component {

    state = {
        fee: null,
        value: '',
        address: '',
        activeInput: null,
        sendingTransaction: false
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

        switch (activeInput) {
            case 'fiat':
                return dataValue.div(ticker.priceFiat).round(8);

            case 'coin':
            default:
                return dataValue.round(8);
        }
    }

    getFee() {
        return this.state.fee ? new BigNumber(this.state.fee).round(8) : null;
    }

    getBalance() {
        return new BigNumber(Wallet.Helper.calculateBalance(this.props.balance)).round(8);
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

            const valueSet = () => {
                if (val > 0) {
                    this.onChangeTxValueDebounce();
                }
            };

            this.setState(() => {
                return {
                    value: val,
                    fee: null,
                    activeInput: val ? type : null
                };
            }, valueSet);
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

    validateData() {
        const fee = this.getFee();
        const coinValue = this.getCoinValue();

        const {coin} = this.props;

        if (coinValue <= 0) {
            throw new Error("Oh snap! Set value to sent");
        }

        const walletBalance = this.getBalance();
        const remaining = walletBalance.minus(fee ? fee : 0).minus(coinValue);

        if (remaining < 0) {
            throw new Error("Oh snap! It seems there is not enough funds.");
        }

        const berryCoin = Coin.makeCoin(coin.getUnit());

        try {
            berryCoin.getKeyFormat().parseAddress(this.state.address);
        } catch (error) {
            throw new Error(`Oh snap! Put valid ${coin.getName()} address`);
        }

        return {
            coinKey: coin.key,
            address: this.state.address,
            value: coinValue
        };
    }

    createTransaction = (event) => {
        event.preventDefault();
        let newTxRequestParams = null;

        try {
            newTxRequestParams = this.validateData();
        } catch (error) {
            showAlert({
                message: error.message
            });

            return;
        }

        const onSuccess = (response) => {
            this.setState(() => {
                return {
                    value: '',
                    address: '',
                    activeInput: null
                };
            });

            this.setSending(false);
        };

        const onError = (error) => {
            showAlert({
                message: error.message
            });
            this.setSending(false);
        };

        this.setSending(true);

        Background
            .sendRequest(Controller.WalletEvent.CreateTransaction, newTxRequestParams)
            .then(onSuccess)
            .catch(onError);
    };

    setSending = (sendingTransaction) => {
        this.setState(() => ({sendingTransaction}));
    };

    render() {
        const {
            coin,
            fiat,
            ticker
        } = this.props;

        const {address, activeInput, value = 0, sendingTransaction} = this.state;

        const fee = this.getFee();
        const coinValue = this.getCoinValue();
        const walletBalance = this.getBalance();

        const remaining = walletBalance.minus(fee ? fee : 0).minus(coinValue);
        remaining.round(8);

        const disabledSend = !this.state.address || coinValue <= 0;

        const baseRowProps = {
            coin: coin,
            fiat: fiat,
            ticker: ticker,
        };

        const footerRows = [{
            value: walletBalance,
            isError: coinValue > 0 && remaining < 0,
            label: "Spendable balance",
            key: 'spendable-balance',
            ...baseRowProps,
        }];

        if (coinValue > 0) {
            footerRows.push({
                value: remaining > 0 ? remaining : 0,
                loading: !fee,
                label: "Remaining Balance",
                key: 'balance',
                ...baseRowProps
            });

            footerRows.push({
                value: fee,
                loading: !fee,
                label: `${coin.getName()} Network Fee`,
                key: 'fee',
                ...baseRowProps
            });
        }

        return (
            <div className={classNames("wallet-wrapper", "send")}>
                <TrackScreenView trackLabel="wallet-send"/>

                <div className={classNames("send-process", sendingTransaction && "-sending")}>
                    <div className="send-process__overlay"/>
                    <div className="send-process__info">Sending...</div>
                </div>

                <form onSubmit={this.createTransaction}>
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
                    <Button className="-full-size" disabled={disabledSend} type="submit">Send</Button>
                </form>

                <FooterComponent footerRows={reverse(footerRows)}/>
            </div>
        )
    }
}
