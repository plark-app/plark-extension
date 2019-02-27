import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { Wallet } from '@plark/wallet-core';
import { ArrowRight, Tick } from 'svg';
import { Coins } from 'Core';
import { Controller } from 'Core/Actions';
import { IStore } from 'Core/Declarations/Store';
import { CoinIcon } from 'Popup/components/coin-icon';
import { Selector } from 'Popup/Store';
import { Background } from 'Popup/Service';
import { Button, Alert } from 'Popup/UI';
import { CoinCard } from './coin-card';

import { ModalLayout } from '../../ModalLayout';
import { closeModal } from '../../observer';

import './modal-exchange.scss';

interface IExchangeModalState {
    waitingWallet: boolean;
    waitingExchanging: boolean;
    successfulExchange: boolean;
}

class Exchange extends React.PureComponent<TExchangeModalProps, IExchangeModalState> {
    public state: IExchangeModalState = {
        waitingWallet: false,
        waitingExchanging: false,
        successfulExchange: false,
    };

    private activateWallet = () => {
        const { toCoin } = this.props;

        Background.sendRequest(Controller.WalletEvent.ActivateCoin, {
            coin: toCoin.getKey(),
        });

        this.setState({ waitingWallet: true });
    };

    private closeModal = () => {
        closeModal();
    };

    private tryExchange = async () => {
        const { fromCoin, toCoin, fromValue, fromTicker } = this.props;

        const payload = {
            from: fromCoin.getKey(),
            to: toCoin.getKey(),
            value: fromValue.toString(),
        };

        this.setState({ waitingExchanging: true });

        try {
            const tx: Wallet.Entity.WalletTransaction = await Background
                .sendRequest(Controller.Exchange.TryExchange, payload);

            this.setState({ successfulExchange: true });
        } catch (error) {
            Alert.showAlert({ message: error.message });

            this.setState({ waitingExchanging: false });
        }
    };

    protected renderNoWalletScreen = () => {
        const { toCoin } = this.props;
        const { waitingWallet } = this.state;

        return (
            <div className="modal-exchange">
                <CoinIcon coin={toCoin.getKey()} className="modal-exchange__icon" size={40} />
                <h2 className="title -modal">Create {toCoin.getName()} Wallet?</h2>
                <p className="desc">
                    To make this transaction, you need to have an {toCoin.getName()} wallet.
                    <br />
                    Create an {toCoin.getName()} wallet?
                </p>

                <div className="modal-buttons">
                    <Button onClick={this.activateWallet} width={200} loading={waitingWallet}>Create Wallet</Button>
                    <br />
                    <Button onClick={this.closeModal} isLight={true}>Cancel</Button>
                </div>
            </div>
        );
    };


    protected renderExchangeConfirmation = () => {
        const { fromCoin, toCoin, fromValue, toValue, fromTicker, toTicker, fiat } = this.props;
        const { waitingExchanging } = this.state;

        return (
            <div className="modal-exchange">
                <h2 className="title -modal">Exchange Confirmation</h2>
                <p className="desc">Please confirm your transaction</p>

                <div className="modal-exchange-info">
                    <CoinCard
                        label="Exchange"
                        coin={fromCoin}
                        ticker={fromTicker}
                        value={fromValue}
                        fiat={fiat}
                        isRight={false}
                    />

                    <ArrowRight className="modal-exchange-info-separator" />

                    <CoinCard
                        label="Receive"
                        coin={toCoin}
                        ticker={toTicker}
                        value={toValue}
                        fiat={fiat}
                        isRight={true}
                    />
                </div>

                <div className="modal-buttons">
                    <Button onClick={this.tryExchange} width={200} loading={waitingExchanging}>Exchange</Button>
                </div>
            </div>
        );
    };

    protected renderSuccessfulExchange = () => {
        const { toCoin } = this.props;

        return (
            <div className="modal-exchange">

                <Tick className="success-icon" />

                <h2 className="title -modal">Transaction successful!</h2>
                <p className="desc">Need some time to receive {toCoin.getName()}.</p>

                <div className="modal-buttons">
                    <Button onClick={this.closeModal} width={200}>OK</Button>
                </div>
            </div>
        );
    };

    public render(): JSX.Element {
        const { toWDProvider } = this.props;

        const { successfulExchange } = this.state;

        if (!toWDProvider) {
            return <ModalLayout>{this.renderNoWalletScreen()}</ModalLayout>;
        }

        if (successfulExchange) {
            return <ModalLayout>{this.renderSuccessfulExchange()}</ModalLayout>;
        }

        return <ModalLayout>{this.renderExchangeConfirmation()}</ModalLayout>;
    }
}

type TExchangeModalOwnProps = {
    fromCoin: Coins.CoinInterface;
    toCoin: Coins.CoinInterface;
    fromValue: BigNumber;
    toValue: BigNumber;
};

type TReduxProps = {
    toWDProvider?: Wallet.Provider.WDProvider;
    fromTicker: Coins.TickerData;
    toTicker: Coins.TickerData;
    fiat: Coins.FiatData;
};

type TExchangeModalProps = TExchangeModalOwnProps & TReduxProps;

const mapStateToProps = (store: IStore, ownProps: TExchangeModalOwnProps): TReduxProps => {
    return {
        toWDProvider: Selector.walletProviderSelector(store)(ownProps.toCoin.getKey()),
        fromTicker: Selector.tickerSelector(store)(ownProps.fromCoin.getKey()),
        toTicker: Selector.tickerSelector(store)(ownProps.toCoin.getKey()),
        fiat: Selector.currentFiatSelector(store),
    };
};

export const ExchangeModal = compose<TExchangeModalProps, TExchangeModalOwnProps>(connect(mapStateToProps))(Exchange);
