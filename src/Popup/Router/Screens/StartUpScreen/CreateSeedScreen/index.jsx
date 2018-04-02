import React from 'react';
import BIP39 from 'bip39';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {WelcomeAction} from 'Core/Actions/Reducer';

import proxyStore from 'Popup/Store';
import {mapWelcomeDispatchers} from 'Popup/Store/KeyringConnector';
import WelcomeLink from 'Popup/Router/Screens/StartUpScreen/Parts/WelcomeLink';
import WelcomeLayout from '../Parts/WelcomeLayout';
import NoticePart from './NoticePart';
import PhrasePart from './PhrasePart';
import CheckPart from './CheckPart';

const mapStateToProps = (state) => {
    return {
        seed: state.Welcome.seed
    };
};

@connect(mapStateToProps, mapWelcomeDispatchers)
export default class CreateSeedScreen extends React.Component {

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
        const {seed} = this.props;

        return <PhrasePart seed={seed}/>
    };

    drawCheckPart = () => {
        const {seed} = this.props;

        return <CheckPart seed={seed}/>
    };

    drawNoticePart = () => {
        const {seed} = this.props;

        return <NoticePart seed={seed}/>
    };

    render() {
        const {seed, match} = this.props;

        if (!seed) {
            return null;
        }

        const welcomeProps = {
            className: "startup-create",
            trackLabel: "startup-create"
        };

        return (
            <WelcomeLayout {...welcomeProps}>
                <Switch>
                    <Route path={`${match.path}`} render={this.drawNoticePart} exact={true}/>
                    <Route path={`${match.path}/phrase`} render={this.drawPhrasePart}/>
                    <Route path={`${match.path}/check`} render={this.drawCheckPart}/>
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