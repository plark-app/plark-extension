import React from 'react';
import { Dictionary } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { CoinSymbol, FiatInterface, FiatSymbol, TickerInterface } from 'Core/Coins';
import { IStore } from 'Core/Declarations/Store';
import { currentFiatSelector, coinStateSelector } from 'Popup/Store/Selector';

interface CurrentFiat {
    key: FiatSymbol;
    fiat: FiatInterface;
    tickers: Dictionary<TickerInterface>;

    getTicker(coinSymbol: CoinSymbol): TickerInterface;
}

const { Provider, Consumer } = React.createContext<CurrentFiat>(null);


class CurrentFiatProviderComponent extends React.PureComponent<ProviderStoreProps> {
    public render(): JSX.Element {
        const { fiat, tickers = {}, children } = this.props;

        const providerValue = {
            key: fiat.key,
            fiat: fiat,
            tickers: tickers,
            getTicker: this.getCoinTicker,
        };

        return <Provider value={providerValue}>{children}</Provider>;
    }

    protected getCoinTicker = (coinSymbol: CoinSymbol): TickerInterface => {
        const { tickers = {} } = this.props;

        return tickers[coinSymbol] || {
            key: coinSymbol,
            priceBtc: 0,
            priceUsd: 0,
            priceFiat: 0,
        } as TickerInterface;
    };
}

type ProviderStoreProps = {
    fiat: FiatInterface;
    tickers: Dictionary<TickerInterface>;
};

export const CurrentFiatProvider = compose<ProviderStoreProps, object>(
    connect((store: IStore): ProviderStoreProps => {
        return {
            fiat: currentFiatSelector(store),
            tickers: coinStateSelector(store).tickers,
        };
    }),
)(CurrentFiatProviderComponent);

export type WithCurrentFiatProps = {
    currentFiat: CurrentFiat;
};

export function withCurrentFiat<P extends WithCurrentFiatProps>(
    WrappedComponent: React.ComponentType<P>,
): React.SFC<Omit<P, WithCurrentFiatProps>> {
    type Props = Omit<P, WithCurrentFiatProps>;

    return (props: Props) => (
        <Consumer>
            {(currentFiat?: CurrentFiat) => (
                <WrappedComponent currentFiat={currentFiat} {...props} />
            )}
        </Consumer>
    );
}
