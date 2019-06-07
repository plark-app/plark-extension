import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { Constants } from '@plark/wallet-core';
import { InputCheck } from 'Popup/UI';
import { Background, Analytics } from 'Popup/Service';
import { OptionEvent } from 'Core/Actions/Controller';

const mapStateToProps = (store) => {
    return {
        currentFee: store.Option.fee
    }
};

const feesList = [{
    key: Constants.FeeTypes.High,
    name: 'Fast',
    subname: 'Pricey Fees'
}, {
    key: Constants.FeeTypes.Medium,
    name: 'Average',
    subname: 'Average Fees'
}, {
    key: Constants.FeeTypes.Low,
    name: 'Slow',
    subname: 'Cheap Fees'
}];

@connect(mapStateToProps)
export class MiningFeeScreen extends React.Component {

    onChangeFee = (event) => {
        const feeKey = event.target.value;

        Background
            .sendRequest(OptionEvent.SetFee, {fee: feeKey})
            .then(this.onPreparedResponse);

        Analytics.event('SETTINGS', 'CHANGE_FEE', feeKey);
    };

    drawFeeRow = (feeItem) => {
        const {currentFee} = this.props;

        return (
            <label key={feeItem.key} className="row fee-item">
                <div>
                    <span className="text-dark fee-item__basename">{feeItem.name}</span> {' '}
                    <span>{feeItem.subname}</span>
                </div>
                <InputCheck type="radio"
                            name="fee-select"
                            checked={feeItem.key === currentFee}
                            value={feeItem.key}
                            onChange={this.onChangeFee}
                />
            </label>
        );
    };

    render() {
        return (
            <div>
                <div className="page-head">
                    <h1 className="title">Mining Fee Speed</h1>
                    <p className="text-center">
                        You can choose the speed of your<br />
                        wallet transactions
                    </p>
                </div>

                <div className="page-list">
                    {map(feesList, this.drawFeeRow)}
                </div>
            </div>
        );
    }
}
