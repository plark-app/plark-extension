import React from 'react';
import {Route, Switch} from 'react-router-dom';

import WelcomeScreen from './WelcomeScreen';
import ImportSeedScreen from './ImportSeedScreen';
import CreateSeedScreen from './CreateSeedScreen';
import ChooseCoinsScreen from './ChooseCoinsScreen';
import CreatePasscodeScreen from './CreatePasscodeScreen';
import PasscodeSuccessScreen from './PasscodeSuccessScreen';
import {PrepareWalletScreen} from './PrepareWalletScreen';

export default class StartUpScreen extends React.Component {
    render() {
        const {path} = this.props.match;
        return (
            <Switch>
                <Route path={`${path}`} component={WelcomeScreen} exact={true}/>
                <Route path={`${path}/import`} component={ImportSeedScreen}/>
                <Route path={`${path}/create`} component={CreateSeedScreen}/>
                <Route path={`${path}/passcode`} component={CreatePasscodeScreen}/>
                <Route path={`${path}/passcode-success`} component={PasscodeSuccessScreen}/>
                <Route path={`${path}/coins`} component={ChooseCoinsScreen}/>
                <Route path={`${path}/prepare`} component={PrepareWalletScreen}/>
            </Switch>
        )
    }
}
