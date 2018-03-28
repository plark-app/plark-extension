import React from 'react';
import {connect} from 'react-redux';
import {Button} from "Popup/Router/UIComponents";
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";

const mapStateToProps = (store) => {

    const baseCoin = store.Coin.currentCoinKey;
    const quoteCoin = store.Coin.coins[0];

    return {
        baseCoin: baseCoin,
        quoteCoin: quoteCoin
    };
};

@connect(mapStateToProps)
export default class ExchangeScreen extends React.Component {
    render() {
        return <div className="exchange">
            <TrackScreenView trackLabel="exchange"/>

            <div className="exchange-sides">
                <div className="exchange-side">{this.props.baseCoin}</div>
                <div className="exchange-side">{this.props.quoteCoin}</div>
            </div>

            <Button className="-full-size" disabled={true}>Exchange</Button>
        </div>
    }
}
