import React from 'react';
import {connect} from 'react-redux';
import BigNumber from 'bignumber.js';
import {Wallet} from '@berrywallet/core';
import classNames from 'classnames';
import ReactSVG from 'react-svg';
import {Coins} from "Core";
import {Controller} from "Core/Actions";
import {IStore} from "Core/Declarations/Store";
import {Selector} from "Popup/Store";
import {Button, CoinIcon, ValueSnippet, Alert} from "Popup/UI";
import {Background, Analytics} from 'Popup/Service';

import {ModalLayout} from "../../ModalLayout";
import {modalObserverInstance} from "../../Observer";

import './modal-exchange.scss';

interface IExchangeModalProps {
    fromCoin: Coins.CoinInterface;
    toCoin: Coins.CoinInterface;
    fromValue: BigNumber;
    toValue: BigNumber;
}

interface IMappedProps {
    toWDProvider?: Wallet.Provider.WDProvider;
    fromTicker: Coins.TickerInterface;
    toTicker: Coins.TickerInterface;
    fiat: Coins.FiatInterface;
}

interface IExchangeModalState {
    waitingWallet: boolean;
    waitingExchanging: boolean;
    successfulExchange: boolean;
}

type IExchangeProps = IExchangeModalProps & IMappedProps;


interface ExchangeCoinCardProps {
    coin: Coins.CoinInterface;
    ticker: Coins.TickerInterface;
    value: BigNumber;
    isRight: boolean;
    label: string;
    fiat: Coins.FiatInterface;
}


const ExchangeCoinCard = (props: ExchangeCoinCardProps): JSX.Element => {
    const {coin, ticker, value, isRight, label, fiat} = props;
    return (
        <div className="stack-card modal-exchange-info__card">
            <div className={classNames("modal-exchange-info__card-coin", isRight && '-right', 'text-' + coin.getKey())}>
                <CoinIcon coin={coin.getKey()} size={20}/> {coin.getName()}
            </div>

            <ValueSnippet
                label={label}
                coin={coin}
                ticker={ticker}
                value={value}
                fiat={fiat}
                className="modal-exchange-info__card-total"
                isRight={isRight}
                isLeft={!isRight}
            />
        </div>
    )
};

class Exchange extends React.Component<IExchangeProps, IExchangeModalState> {

    public state: IExchangeModalState = {
        waitingWallet: false,
        waitingExchanging: false,
        successfulExchange: false
    };

    private activateWallet = () => {
        const {toCoin} = this.props;

        Background.sendRequest(Controller.WalletEvent.ActivateCoin, {
            coin: toCoin.getKey()
        });

        this.setState(() => ({waitingWallet: true}));
    };

    private closeModal = () => {
        modalObserverInstance.closeModal();
    };

    private tryExchange = () => {
        const {fromCoin, toCoin, fromValue, fromTicker} = this.props;

        const payload = {
            from: fromCoin.getKey(),
            to: toCoin.getKey(),
            value: fromValue.toNumber()
        };

        const onSuccess = (data) => {
            this.setState(() => ({successfulExchange: true}));

            Analytics.event(
                "Exchange",
                "success",
                `${fromCoin.getUnit()} to ${toCoin.getUnit()}`,
                // fromValue.mul(fromTicker.priceFiat).mul(0.0025).round(2).toNumber()
            );
        };

        const onError = (error) => {
            Alert.showAlert({
                message: error.message
            });

            this.setState(() => ({waitingExchanging: false}));
        };

        Background
            .sendRequest(Controller.Exchange.TryExchange, payload)
            .then(onSuccess, onError)
            .catch(onError);

        this.setState(() => ({waitingExchanging: true}));
    };

    renderNoWalletScreen = () => {
        const {toCoin} = this.props;
        const {waitingWallet} = this.state;

        return (
            <div className="modal-exchange">
                <CoinIcon coin={toCoin.getKey()} className="modal-exchange__icon" size={40}/>
                <h2 className="title -modal">Create {toCoin.getName()} Wallet?</h2>
                <p className="desc">
                    To make this transaction, you need to have an {toCoin.getName()} wallet.
                    <br/>
                    Create an {toCoin.getName()} wallet?
                </p>

                <div className="modal-buttons">
                    <Button onClick={this.activateWallet} width={200} loading={waitingWallet}>
                        Create Wallet
                    </Button>
                    <br/>
                    <Button onClick={this.closeModal} isLight={true}>Cancel</Button>
                </div>
            </div>
        )
    };


    renderExchangeConfirmation = () => {
        const {fromCoin, toCoin, fromValue, toValue, fromTicker, toTicker, fiat} = this.props;
        const {waitingExchanging} = this.state;

        return (
            <div className="modal-exchange">
                <h2 className="title -modal">Exchange Confirmation</h2>
                <p className="desc">Please confirm your transaction</p>

                <div className="modal-exchange-info">
                    <ExchangeCoinCard label="Exchange"
                                      coin={fromCoin}
                                      ticker={fromTicker}
                                      value={fromValue}
                                      fiat={fiat}
                                      isRight={false}
                    />

                    <div className="modal-exchange-info-separator">-></div>

                    <ExchangeCoinCard label="Receive"
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
        )
    };

    renderSuccessfulExchange = () => {
        const {toCoin} = this.props;

        return (
            <div className="modal-exchange">

                <ReactSVG path="/images/icons/tick.svg"
                          className="success-icon"
                          wrapperClassName="success-icon-wrapper"
                />

                <h2 className="title -modal">Transaction successful!</h2>
                <p className="desc">Need some time to receive {toCoin.getName()}.</p>

                <div className="modal-buttons">
                    <Button onClick={this.closeModal} width={200}>OK</Button>
                </div>
            </div>
        )
    };

    render() {
        const {toWDProvider} = this.props;

        const {successfulExchange} = this.state;

        if (!toWDProvider) {
            return <ModalLayout>{this.renderNoWalletScreen()}</ModalLayout>;
        }

        if (successfulExchange) {
            return <ModalLayout>{this.renderSuccessfulExchange()}</ModalLayout>;
        }

        return <ModalLayout>{this.renderExchangeConfirmation()}</ModalLayout>;
    }
}

const mapStateToProps = (store: IStore, ownProps: IExchangeModalProps): IMappedProps => {
    return {
        toWDProvider: Selector.walletProviderSelector(store)(ownProps.toCoin.getKey()),
        fromTicker: Selector.tickerSelector(store)(ownProps.fromCoin.getKey()),
        toTicker: Selector.tickerSelector(store)(ownProps.toCoin.getKey()),
        fiat: Selector.currentFiatSelector(store)
    }
};


export const ExchangeModal = connect(mapStateToProps)(Exchange);