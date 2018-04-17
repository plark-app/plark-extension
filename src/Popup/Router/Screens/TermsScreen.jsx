import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import screenHistory from 'Popup/ScreenAddressHistory';
import {Button} from "Popup/UI";
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';

import proxyStore from 'Popup/Store';

const mapStateToProps = (store) => ({
    terms: store.Terms
});

@connect(mapStateToProps)
export default class TermsScreen extends React.Component {

    onClickAgreeButton = () => {
        const {location} = this.props;
        proxyStore.dispatch({
            type: 'TERMS::AGREE'
        });

        if (location.state) {
            const {returnTo = null} = location.state;
            if (returnTo) {
                screenHistory.push(returnTo);
            }
        } else {
            // @TODO Bycicle made of Pure GOLD.. 
            screenHistory.push('/startup');
        }
    };

    render() {
        return (
            <Fragment>
                <TrackScreenView trackLabel="terms"/>
                <h1>Terms of use</h1>
                <Button onClick={this.onClickAgreeButton}>Agree</Button>
            </Fragment>
        );
    }
}
