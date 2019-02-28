import React from 'react';
import { Dictionary } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { CoinSymbol, FiatData, FiatSymbol, TickerData } from 'Core/Coins';
import { IStore } from 'Core/Declarations/Store';
import { currentFiatSelector, coinStateSelector } from 'Popup/Store/Selector';

interface CurrentFiat {
    key: FiatSymbol;
    fiat: FiatData;
    tickers: Dictionary<TickerData>;

    getTicker(coinSymbol: CoinSymbol): TickerData;
}

const FiatContext = React.createContext<CurrentFiat>(null);

export const useFiat = (): CurrentFiat => {
    return React.useContext(FiatContext);
};

class CurrentFiatProviderComponent extends React.PureComponent<ProviderStoreProps> {
    public render(): JSX.Element {
        const { fiat, tickers = {}, children } = this.props;

        const providerValue = {
            key: fiat.key,
            fiat: fiat,
            tickers: tickers,
            getTicker: this.getCoinTicker,
        };

        return <FiatContext.Provider value={providerValue}>{children}</FiatContext.Provider>;
    }

    protected getCoinTicker = (coinSymbol: CoinSymbol): TickerData => {
        const { tickers = {} } = this.props;

        return tickers[coinSymbol] || {
            key: coinSymbol,
            priceBtc: 0,
            priceUsd: 0,
            priceFiat: 0,
        } as TickerData;
    };
}

type ProviderStoreProps = {
    fiat: FiatData;
    tickers: Dictionary<TickerData>;
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
        <FiatContext.Consumer>
            {(currentFiat?: CurrentFiat) => (
                <WrappedComponent currentFiat={currentFiat} {...props as any} />
            )}
        </FiatContext.Consumer>
    );
}
