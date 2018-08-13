import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import screenHistory from 'Popup/ScreenAddressHistory';
import { Button } from 'Popup/UI';
import proxyStore from 'Popup/Store';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import { IStore, ITermsStore } from 'Core/Declarations/Store';

type TermsProps = RouteComponentProps<object> & {
    terms: ITermsStore
};

export class TermsScreenComponent extends React.Component<TermsProps> {
    protected onClickAgreeButton = () => {
        const { location } = this.props;

        proxyStore.dispatch({
            type: 'TERMS::AGREE',
        });

        if (location.state) {
            const { returnTo = null } = location.state;
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
            <>
                <TrackScreenView trackLabel="terms" />
                <h1>Terms of use</h1>
                <Button onClick={this.onClickAgreeButton}>Agree</Button>
            </>
        );
    }
}

const mapStateToProps = (store: IStore) => {
    return {
        terms: store.Terms,
    };
};

export const TermsScreen = connect(mapStateToProps)(TermsScreenComponent);
