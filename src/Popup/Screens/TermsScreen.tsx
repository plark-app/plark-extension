import React, {Fragment} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {connect} from 'react-redux';
import screenHistory from 'Popup/ScreenAddressHistory';
import {Button} from "Popup/UI";
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';

import proxyStore from 'Popup/Store';
import {IStore, ITermsStore} from "Core/Declarations/Store";

interface IProps extends RouteComponentProps<any> {
    terms: ITermsStore
}

export class TermsScreenComponent extends React.Component<IProps> {

    protected onClickAgreeButton = () => {
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

    public render(): JSX.Element {
        return (
            <Fragment>
                <TrackScreenView trackLabel="terms"/>
                <h1>Terms of use</h1>
                <Button onClick={this.onClickAgreeButton}>Agree</Button>
            </Fragment>
        );
    }
}


export const TermsScreen = connect((store: IStore) => {
    return {
        terms: store.Terms
    };
})(TermsScreenComponent);