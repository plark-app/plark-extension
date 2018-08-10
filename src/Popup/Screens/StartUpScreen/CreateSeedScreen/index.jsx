import React from 'react';
import BIP39 from 'bip39';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { WelcomeAction } from 'Core/Actions/Reducer';

import proxyStore from 'Popup/Store';
import { mapWelcomeDispatchers } from 'Popup/Store/KeyringConnector';
import { WelcomeLink, WelcomeLayout } from '../Parts';
import { NoticeScreen } from './notice-screen';
import PhrasePart from './PhrasePart';
import CheckPart from './CheckPart';

class CreateSeedScreenComponent extends React.Component {

    componentDidMount() {
        const {seed} = this.props;

        if (!seed) {
            proxyStore.dispatch({
                type: WelcomeAction.SetSeed,
                seed: BIP39.generateMnemonic()
            });
        }
    }

    onBack = () => {
        proxyStore.dispatch({type: WelcomeAction.ClearSeed});
    };

    drawPhrasePart = () => {
        const { seed } = this.props;

        return <PhrasePart seed={seed} />
    };

    drawCheckPart = () => {
        const { seed } = this.props;

        return <CheckPart seed={seed} />
    };

    drawNoticePart = () => {
        const { seed } = this.props;

        return <NoticeScreen seed={seed} />
    };

    render() {
        const {seed, match} = this.props;

        if (!seed) {
            return null;
        }

        const welcomeProps = {
            className: 'startup-create',
            trackLabel: 'startup-create'
        };

        return (
            <WelcomeLayout {...welcomeProps}>
                <Switch>
                    <Route path={`${match.path}`} render={this.drawNoticePart} exact={true} />
                    <Route path={`${match.path}/phrase`} render={this.drawPhrasePart} />
                    <Route path={`${match.path}/check`} render={this.drawCheckPart} />
                </Switch>

                <WelcomeLink
                    to="/startup"
                    className="startup-back-link"
                    onClick={this.onBack}
                >← Back to previous screen</WelcomeLink>
            </WelcomeLayout>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        seed: state.Welcome.seed
    };
};

export const CreateSeedScreen = connect(mapStateToProps, mapWelcomeDispatchers)(CreateSeedScreenComponent);