import React from 'react';
import { reverse, debounce } from 'lodash';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import cn from 'classnames';
import Numeral from 'numeral';

import { Wallet, Coin } from '@berrywallet/core';

import { Controller } from 'Core/Actions';
import { Button, Alert } from 'Popup/UI';
import { mapWalletCoinToProps } from 'Popup/Store/WalletCoinConnector';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import { Background } from 'Popup/Service';

import { FooterComponent } from './footer-component';
import { FooterRowProps } from './send-data-footer-row';

type SendScreenState = {
    fee?: number | string;
    loadingFee: boolean;

    value: string;
    address: string;
    activeInput?: 'fiat' | 'coin';
    sendingTransaction: boolean;
};

// @TODO Need implemenet Props and State interface
class SendScreen extends React.PureComponent<any, SendScreenState> {
    public state = {
        fee: undefined,
        loadingFee: false,

        value: '',
        address: '',
        activeInput: undefined,
        sendingTransaction: false,
    };

    protected onChangeTxValueDebounce;

    public constructor(props) {
        super(props);

        this.onChangeTxValueDebounce = debounce(this.onChangeTxValue, 300);
    }

    protected getCoinValue(): BigNumber {
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

    protected createTransaction = async (event): Promise<void> => {
        event.preventDefault();
        let newTxRequestParams = null;

        try {
            newTxRequestParams = this.validateData();
        } catch (error) {
            Alert.showAlert({ message: error.message });

            return;
        }

        this.setSending(true);

        try {
            await Background.sendRequest(Controller.WalletEvent.CreateTransaction, newTxRequestParams);

            Alert.showAlert({
                type: 'success',
                message: 'Transaction successfully sent',
            });

            this.setState({
                value: '',
                address: '',
                activeInput: undefined,
            });

        } catch (error) {
            Alert.showAlert({
                message: error.message,
            });

            this.setSending(false);
        }


        this.setSending(false);
    };

    public render(): JSX.Element {
        const { coin, fiat, ticker } = this.props;

        const { address, activeInput, value = 0, sendingTransaction, loadingFee = false } = this.state;

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

        const footerRows: FooterRowProps[] = [];

        footerRows.push({
            value: walletBalance,
            isError: coinValue.gt(0) && remaining.lt(0),
            label: 'Spendable balance',
            key: 'spendable-balance',
            ...baseRowProps,
        } as FooterRowProps);

        if (coinValue.isGreaterThan(0) && (fee || loadingFee)) {
            footerRows.push({
                value: remaining.gt(0) ? remaining : 0,
                loading: loadingFee,
                label: 'Remaining Balance',
                key: 'balance',
                ...baseRowProps,
            } as FooterRowProps);

            footerRows.push({
                value: fee,
                loading: loadingFee,
                label: `${coin.getName()} Network Fee`,
                key: 'fee',
                ...baseRowProps,
            } as FooterRowProps);
        }

        return (
            <div className={cn('wallet-wrapper', 'send')}>
                <TrackScreenView trackLabel={`wallet-${coin.getKey()}-send`} />

                <div className={cn('send-process', sendingTransaction && '-sending')}>
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

    protected getFee(): BigNumber | undefined {
        return this.state.fee ? new BigNumber(this.state.fee).decimalPlaces(8) : undefined;
    }

    protected getBalance(): BigNumber {
        return new BigNumber(Wallet.calculateBalance(this.props.balance)).decimalPlaces(8);
    }

    protected onChangeAddress = (event): void => {
        const addressValue = event.target.value;
        this.setState({ address: addressValue });
    };

    protected onChangeValueInput = (type) => {
        return (event): void => {
            const val = event.target.value;

            const valueSet = () => {
                if (val > 0) {
                    this.onChangeTxValueDebounce();
                }
            };

            this.setState({
                value: val,
                fee: undefined,
                loadingFee: true,
                activeInput: val ? type : undefined,
            }, valueSet);
        };
    };

    protected onChangeTxValue = async (): Promise<void> => {
        if (!this.state.address) {
            this.setState({ loadingFee: false });

            return;
        }

        const newTxRequestParams = {
            coinKey: this.props.coin.key,
            address: this.state.address,
            value: this.getCoinValue().toString(),
        };

        try {
            const res = await Background.sendRequest(Controller.WalletEvent.CalculateFee, newTxRequestParams);
            if (!res) {
                return;
            }

            this.setState({ fee: res.fee, loadingFee: false });
        } catch (error) {
            this.setState({ fee: undefined, loadingFee: false });
        }
    };

    protected validateData() {
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

    protected setSending = (sendingTransaction: boolean) => {
        this.setState({
            sendingTransaction: sendingTransaction,
        });
    };
}

export const SeedScreenComponent = connect(mapWalletCoinToProps)(SendScreen);
