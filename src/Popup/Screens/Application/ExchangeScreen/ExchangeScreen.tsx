import React from 'react';
import BigNumber from 'bignumber.js';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {BeShapyUnits} from 'BeShapy';

import {Controller} from 'Core/Actions';
import {Background} from 'Popup/Service';
import {Button} from "Popup/UI";
import screenHistory from 'Popup/ScreenAddressHistory';
import {Coins} from 'Core';
import {IStore} from "Core/Declarations/Store";
import {Selector} from 'Popup/Store';
import {TrackScreenLayout} from 'Popup/UI/Layouts';
import {extractTicker} from 'Popup/Store/Helpers';
import {modalObserverInstance, ModalType} from "Popup/Modals";

import {CoinSideComponent} from "./Side";
import {FooterComponent} from "./FooterComponent";

export interface ExchangeMountedProps {
    fromCoin: Coins.CoinInterface;
    fromTicker: Coins.TickerInterface;

    toCoin: Coins.CoinInterface;
    toTicker: Coins.TickerInterface;
    fromBalance: number;
}

export interface ExchangeUrlParams {
    fromCoin: Coins.CoinSymbol;
    toCoin: Coins.CoinSymbol;
}

export type IExchangeProps = RouteComponentProps<ExchangeUrlParams> & ExchangeMountedProps;


enum SideTypes {
    From = "FROM",
    To = 'TO'
}

interface IExchangeState {
    masterSide: SideTypes;
    value: BigNumber;
    marketInfo?: BeShapyUnits.MarketInfo;
}

class ExchangeScreen extends React.Component<IExchangeProps, IExchangeState> {

    public state: IExchangeState = {
        masterSide: SideTypes.From,
        value: new BigNumber(0),
        marketInfo: null
    };

    public componentDidMount() {
        this.loadMarketInfo();
    }

    public componentDidUpdate(oldProps: IExchangeProps) {
        const {fromCoin, toCoin} = this.props;
        if (oldProps.fromCoin !== fromCoin || oldProps.toCoin !== toCoin) {
            this.setState(this.marketInfoSetter(null));
            this.loadMarketInfo();
        }
    }

    public loadMarketInfo = () => {
        const {fromCoin, toCoin} = this.props;

        const onSuccessLoad = (marketInfo: BeShapyUnits.MarketInfo) => {
            this.setState(this.marketInfoSetter(marketInfo));
        };

        Background
            .sendRequest(Controller.Exchange.GetPair, {
                from: fromCoin.getKey(),
                to: toCoin.getKey()
            })
            .then(onSuccessLoad);
    };

    public marketInfoSetter = (marketInfo?: BeShapyUnits.MarketInfo) => {
        return {
            marketInfo: marketInfo
        }
    };

    public generateOnSetValue = (sideType: SideTypes) => {
        return (value?: BigNumber) => {
            this.setState(() => {
                return {
                    masterSide: sideType,
                    value: value
                }
            });
        }
    };

    get isEnableExchange(): boolean {
        const {marketInfo} = this.state;
        const {fromBalance} = this.props;
        const value = this.fromValue;

        if (marketInfo !== null &&
            value.greaterThan(0) &&
            value.lessThan(fromBalance) &&
            value.greaterThanOrEqualTo(marketInfo.minimum) &&
            value.lessThanOrEqualTo(marketInfo.limit)
        ) {
            return true;
        }

        return false;
    }

    get rate(): BigNumber {
        const {marketInfo} = this.state;

        return new BigNumber(marketInfo ? marketInfo.rate : 0);
    }

    get fromValue(): BigNumber {
        const {masterSide, value, marketInfo} = this.state;
        if (!marketInfo) {
            return new BigNumber(0);
        }

        if (masterSide === SideTypes.From) {
            return value;
        }

        return value.add(marketInfo.minerFee).div(this.rate);
    }

    get toValue(): BigNumber {
        const {masterSide, value, marketInfo} = this.state;
        if (!marketInfo) {
            return new BigNumber(0);
        }

        if (masterSide === SideTypes.To) {
            return value;
        }
        
        return value.mul(this.rate).minus(marketInfo.minerFee);
    }

    onSubmitForm = (event) => {
        const {fromCoin, toCoin} = this.props;
        event.preventDefault();

        modalObserverInstance.openModal(ModalType.Exchange, {
            fromCoin: fromCoin,
            toCoin: toCoin,
            fromValue: this.fromValue,
            toValue: this.toValue
        });
    };

    render() {
        const {fromCoin, toCoin, fromTicker, toTicker} = this.props;
        const {masterSide, marketInfo} = this.state;

        const trackLabel = `exchange-${fromCoin.getKey()}-${toCoin.getKey()}`;

        return <TrackScreenLayout className="exchange" trackLabel={trackLabel}>
            <form onSubmit={this.onSubmitForm} className="exchange-form">
                <div className="exchange-sides">
                    <CoinSideComponent label="Exchange"
                                       resultLabel="You are exchanging"
                                       isReady={!marketInfo}
                                       fromCoin={fromCoin}
                                       toCoin={toCoin}
                                       isFrom={true}
                                       ticker={fromTicker}
                                       isMaster={masterSide === SideTypes.From}
                                       value={this.fromValue}
                                       onSetValue={this.generateOnSetValue(SideTypes.From)}
                    />

                    <CoinSideComponent label="Receive"
                                       resultLabel="You will receive"
                                       isReady={!marketInfo}
                                       fromCoin={fromCoin}
                                       toCoin={toCoin}
                                       isFrom={false}
                                       ticker={toTicker}
                                       isMaster={masterSide === SideTypes.To}
                                       value={this.toValue}
                                       onSetValue={this.generateOnSetValue(SideTypes.To)}
                    />
                </div>

                <Button className="-full-size" disabled={!this.isEnableExchange}>Exchange</Button>

                <FooterComponent fromCoin={fromCoin} toCoin={toCoin} marketInfo={marketInfo}/>
            </form>
        </TrackScreenLayout>
    }
}


const mapStateToProps = (store: IStore, ownProps: IExchangeProps): ExchangeMountedProps => {
    const {fromCoin, toCoin} = ownProps.match.params;

    const fromCoinItem = Coins.findCoin(fromCoin);
    const toCoinItem = Coins.findCoin(toCoin);

    if (!fromCoinItem || !toCoinItem) {
        screenHistory.push('/app/wallet');

        return null;
    }

    return {
        fromCoin: fromCoinItem,
        toCoin: toCoinItem,
        fromTicker: extractTicker(fromCoinItem.getKey()),
        toTicker: extractTicker(toCoinItem.getKey()),
        fromBalance: Selector.walletBalanceSelector(store)(fromCoinItem.getKey())
    };
};

export const ExchangeScreenComponent = connect(mapStateToProps)(ExchangeScreen);