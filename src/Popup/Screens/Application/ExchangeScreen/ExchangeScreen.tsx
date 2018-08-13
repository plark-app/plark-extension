import React from 'react';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { BeShapyUnits } from 'be-shapy';

import { Controller } from 'Core/Actions';
import { Background } from 'Popup/Service';
import { Button } from 'Popup/UI';
import screenHistory from 'Popup/ScreenAddressHistory';
import { Coins } from 'Core';
import { openModal } from 'Popup/Modals';
import { IStore } from 'Core/Declarations/Store';
import { Selector } from 'Popup/Store';
import { extractTicker } from 'Popup/Store/Helpers';
import { TrackScreenLayout } from 'Popup/UI/Layouts';
import { withCurrentFiat, WithCurrentFiatProps } from 'Popup/contexts/current-fiat';

import { CoinSide } from './side';
import { FooterComponent } from './FooterComponent';

enum SideTypes {
    From = "FROM",
    To = 'TO'
}

interface IExchangeState {
    masterSide: SideTypes;
    value: BigNumber;
    marketInfo?: BeShapyUnits.MarketInfo;
}

class ExchangeScreen extends React.Component<ExchangeProps, IExchangeState> {

    public state: IExchangeState = {
        masterSide: SideTypes.From,
        value: new BigNumber(0),
        marketInfo: null,
    };

    public componentDidMount(): void {
        this.updateMarketInfo();
    }

    public componentDidUpdate(oldProps: ExchangeProps): void {
        const { fromCoin, toCoin } = this.props;
        if (oldProps.fromCoin !== fromCoin || oldProps.toCoin !== toCoin) {
            this.setState(this.marketInfoSetter(null));
            this.updateMarketInfo();
        }
    }

    public updateMarketInfo = async (): Promise<void> => {
        const { fromCoin, toCoin } = this.props;

        const marketInfo: BeShapyUnits.MarketInfo = await Background
            .sendRequest<BeShapyUnits.MarketInfo>(Controller.Exchange.GetPair, {
                from: fromCoin.getKey(),
                to: toCoin.getKey(),
            });

        this.setState(this.marketInfoSetter(marketInfo));
    };

    public marketInfoSetter = (marketInfo?: BeShapyUnits.MarketInfo) => {
        return {
            marketInfo: marketInfo,
        };
    };

    public generateOnSetValue = (sideType: SideTypes) => {
        return (value?: BigNumber) => {
            this.setState({
                masterSide: sideType,
                value: value,
            });
        };
    };

    public render(): JSX.Element {
        const { fromCoin, toCoin, currentFiat } = this.props;
        const { masterSide, marketInfo } = this.state;

        const fromTicker = currentFiat.getTicker(fromCoin.getKey());
        const toTicker = currentFiat.getTicker(toCoin.getKey());

        const trackLabel = `exchange-${fromCoin.getKey()}-${toCoin.getKey()}`;

        return (
            <TrackScreenLayout className="exchange" trackLabel={trackLabel}>
                <form onSubmit={this.onSubmitForm} className="exchange-form">
                    <div className="exchange-sides">
                        <CoinSide label="Exchange"
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

                        <CoinSide label="Receive"
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

                    <FooterComponent fromCoin={fromCoin} toCoin={toCoin} marketInfo={marketInfo} />
                </form>
            </TrackScreenLayout>
        );
    }

    protected onSubmitForm = (event) => {
        const { fromCoin, toCoin } = this.props;
        event.preventDefault();

        openModal('/exchange', {
            fromCoin: fromCoin,
            toCoin: toCoin,
            fromValue: this.fromValue,
            toValue: this.toValue,
        });
    };

    protected get isEnableExchange(): boolean {
        const { marketInfo } = this.state;
        const { fromBalance } = this.props;
        const value = this.fromValue;

        if (null !== marketInfo &&
            value.isGreaterThan(0) &&
            value.isLessThan(fromBalance) &&
            value.isGreaterThanOrEqualTo(marketInfo.minimum) &&
            value.isLessThanOrEqualTo(marketInfo.limit)
        ) {
            return true;
        }

        return false;
    }

    protected get rate(): BigNumber {
        const { marketInfo } = this.state;

        return new BigNumber(marketInfo ? marketInfo.rate : 0);
    }

    protected get fromValue(): BigNumber {
        const { masterSide, value, marketInfo } = this.state;
        if (!marketInfo) {
            return new BigNumber(0);
        }

        if (masterSide === SideTypes.From) {
            return value;
        }

        return value.plus(marketInfo.minerFee).div(this.rate);
    }

    protected get toValue(): BigNumber {
        const { masterSide, value, marketInfo } = this.state;
        if (!marketInfo) {
            return new BigNumber(0);
        }

        if (masterSide === SideTypes.To) {
            return value;
        }

        return value.times(this.rate).minus(marketInfo.minerFee);
    }
}


type ExchangeStoreProps = {
    fromCoin: Coins.CoinInterface;
    toCoin: Coins.CoinInterface;

    fromBalance: number;
};

type ExchangeUrlParams = {
    fromCoin: Coins.CoinSymbol;
    toCoin: Coins.CoinSymbol;
};

type ExchangeOwnProps = RouteComponentProps<ExchangeUrlParams>;
type ExchangeProps = ExchangeOwnProps & ExchangeStoreProps & WithCurrentFiatProps;

const mapStateToProps = (store: IStore, ownProps: ExchangeOwnProps): ExchangeStoreProps => {
    const { fromCoin, toCoin } = ownProps.match.params;

    const fromCoinItem = Coins.findCoin(fromCoin);
    const toCoinItem = Coins.findCoin(toCoin);

    if (!fromCoinItem || !toCoinItem) {
        screenHistory.push('/app/wallet');

        return null;
    }

    return {
        fromCoin: fromCoinItem,
        toCoin: toCoinItem,
        fromBalance: Selector.walletBalanceSelector(store)(fromCoinItem.getKey()),
    };
};

export const ExchangeScreenComponent = compose<ExchangeProps, ExchangeOwnProps>(
    withCurrentFiat,
    connect(mapStateToProps),
)(ExchangeScreen);
