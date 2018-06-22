import React from 'react';
import {connect} from 'react-redux';
import {map, filter} from 'lodash';
import {fiatList} from 'Core/Coins';
import {TickerEvent} from 'Core/Actions/Controller';
import {InputCheck, EmptyDummy} from 'Popup/UI';
import {Analytics, Background} from 'Popup/Service';
import {SearchInputComponent} from './components';

export class FiatsScreenComponent extends React.Component {

    state = {
        search: ''
    };

    onChangeSearch = (searchValue) => {
        this.setState(() => {
            return {
                search: searchValue
            };
        });
    };

    getFiatList() {
        const searchString = this.state.search.toLowerCase();

        if (!!searchString) {
            return filter(fiatList, (fiat) => {
                return [fiat.name, fiat.key, fiat.shortName]
                    .join(' ')
                    .toLowerCase()
                    .indexOf(searchString) >= 0;
            });
        }

        return Object.values(fiatList);
    }

    onChangeFiat = (event) => {
        const fiatKey = event.target.value;

        Background
            .sendRequest(TickerEvent.ChangeCurrentFiat, {fiat: fiatKey})
            .then(this.onPreparedResponse);

        Analytics.event('SETTINGS', 'CHANGE_FIAT', fiatKey);
    };

    drawCurrencyRow = (fiat) => {
        const {currentFiatKey} = this.props;

        return (
            <label key={fiat.key} className="row currency-option-item -fiat">
                <div className="currency-option-item__title">
                    <b>{fiat.key}</b> - {fiat.name}
                </div>
                <InputCheck type="radio"
                            name="fiat-select"
                            checked={fiat.key === currentFiatKey}
                            value={fiat.key}
                            onChange={this.onChangeFiat}
                />
            </label>
        );
    };

    render() {

        const filteredFiatList = this.getFiatList();
        return (
            <div className="currency-option">
                <div className="currency-option-head">
                    <h1 className="title currency-option-head__title">Choose your currency</h1>
                    <SearchInputComponent onChangeSearch={this.onChangeSearch}
                                          placeholder="Search Currency"/>
                </div>

                <div className="currency-option-list">
                    {map(filteredFiatList, this.drawCurrencyRow)}
                    <EmptyDummy
                        title="No Such Currency Yet"
                        description="Unfortunately, this currency is unavailable at the moment. More currencies are coming soon."
                        show={filteredFiatList.length === 0}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        currentFiatKey: store.Coin.currentFiatKey
    }
};

export const FiatsScreen = connect(mapStateToProps)(FiatsScreenComponent);