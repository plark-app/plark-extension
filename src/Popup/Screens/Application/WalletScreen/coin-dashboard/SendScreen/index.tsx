import React from 'react';
import { Wallet, Coin } from '@berrywallet/core';
import { reverse, debounce } from 'lodash';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Numeral from 'numeral';

import { Controller } from 'Core/Actions';
import { Button, Alert } from "Popup/UI";
import { mapWalletCoinToProps } from 'Popup/Store/WalletCoinConnector';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import { Background } from 'Popup/Service';

import { FooterComponent } from './FooterComponent';
import { SendDataFooterRow, IFooterRowProps } from './SendDataFooterRow';

// @TODO Need implemenet Props and State interface
class SendScreen extends React.Component<any, any> {

    public state = {
        fee: null,
        value: '',
        address: '',
        activeInput: null,
        sendingTransaction: false,
    };

    protected onChangeTxValueDebounce;

    constructor(props) {
        super(props);

        this.onChangeTxValueDebounce = debounce(this.onChangeTxValue, 300);
    }

    getCoinValue(): BigNumber {
        const { activeInput, value = '' } = this.state;
        const { ticker } = this.props;

        let dataValue = new BigNumber(parseFloat(value.replace(',', '.')) || 0);

        switch (activeInput) {
            case 'fiat':
                return dataValue.div(ticker.priceFiat).decimalPlaces(8);

            case 'coin':
            default:
                return dataValue.decimalPlaces(8);
        }
    }

    getFee(): BigNumber | null {
        return this.state.fee ? new BigNumber(this.state.fee).decimalPlaces(8) : null;
    }

    getBalance(): BigNumber {
        return new BigNumber(Wallet.Helper.calculateBalance(this.props.balance)).decimalPlaces(8);
    }

    onChangeAddress = (event): void => {
        const addressValue = event.target.value;
        this.setState({ address: addressValue });
    };

    onChangeValueInput = (type) => {
        return (event): void => {
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
                    activeInput: val ? type : null,
                };
            }, valueSet);
        };
    };

    onChangeTxValue = async (): Promise<void> => {
        const newTxRequestParams = {
            coinKey: this.props.coin.key,
            address: this.state.address,
            value: this.getCoinValue().toString(),
        };

        const res = await Background.sendRequest(Controller.WalletEvent.CalculateFee, newTxRequestParams);

        if (!res) {
            return;
        }

        this.setState({ fee: res.fee });
    };

    validateData() {
        const fee = this.getFee();
        const coinValue = this.getCoinValue();

        const { coin } = this.props;

        if (coinValue.isLessThanOrEqualTo(0)) {
            throw new Error('Oh snap! Set value to sent');
        }

        const walletBalance = this.getBalance();
        const remaining = walletBalance.minus(fee ? fee : 0).minus(coinValue);

        if (remaining.isLessThan(0)) {
            throw new Error('Oh snap! It seems there is not enough funds.');
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
            value: coinValue.toString(),
        };
    }

    createTransaction = (event): void => {
        event.preventDefault();
        let newTxRequestParams = null;

        try {
            newTxRequestParams = this.validateData();
        } catch (error) {
            Alert.showAlert({ message: error.message });

            return;
        }

        const onSuccess = (response) => {
            Alert.showAlert({
                type: 'success',
                message: 'Transaction successfully sent',
            });

            this.setState(() => {
                return {
                    value: '',
                    address: '',
                    activeInput: null,
                };
            });

            this.setSending(false);
        };

        const onError = (error) => {
            Alert.showAlert({
                message: error.message,
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
        this.setState(() => {
            return {
                sendingTransaction: sendingTransaction,
            };
        });
    };

    public render(): JSX.Element {
        const { coin, fiat, ticker } = this.props;

        const { address, activeInput, value = 0, sendingTransaction } = this.state;

        const fee = this.getFee();
        const coinValue = this.getCoinValue();
        const walletBalance = this.getBalance();

        const remaining = walletBalance.minus(fee ? fee : 0).minus(coinValue);
        remaining.decimalPlaces(8);

        const disabledSend = !this.state.address || coinValue.lte(0);

        const baseRowProps = {
            coin: coin,
            fiat: fiat,
            ticker: ticker,
        };

        const footerRows: IFooterRowProps[] = [];

        footerRows.push({
            value: walletBalance,
            isError: coinValue.gt(0) && remaining.lt(0),
            label: "Spendable balance",
            key: 'spendable-balance',
            ...baseRowProps,
        } as IFooterRowProps);

        if (coinValue.isGreaterThan(0)) {
            footerRows.push({
                value: remaining.gt(0) ? remaining : 0,
                loading: fee === null,
                label: "Remaining Balance",
                key: 'balance',
                ...baseRowProps,
            } as IFooterRowProps);

            footerRows.push({
                value: fee,
                loading: fee === null,
                label: `${coin.getName()} Network Fee`,
                key: 'fee',
                ...baseRowProps,
            } as IFooterRowProps);
        }

        return (
            <div className={classNames("wallet-wrapper", "send")}>
                <TrackScreenView trackLabel={`wallet-${coin.getKey()}-send`} />

                <div className={classNames("send-process", sendingTransaction && "-sending")}>
                    <div className="send-process__overlay" />
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
                                {activeInput === 'coin' ? Numeral(coinValue.times(ticker.priceFiat)).format('0,0.00') : null}
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

                <FooterComponent footerRows={reverse(footerRows)} />
            </div>
        );
    }
}

const SeedScreenComponent = connect(mapWalletCoinToProps)(SendScreen);

export { FooterComponent, SendDataFooterRow, IFooterRowProps, SeedScreenComponent };
