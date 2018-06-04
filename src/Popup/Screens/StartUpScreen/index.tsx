import React from 'react';
import {Route, Switch, RouteComponentProps} from 'react-router-dom';

import {WelcomeScreen} from './WelcomeScreen';
import ImportSeedScreen from './ImportSeedScreen';
import CreateSeedScreen from './CreateSeedScreen';
import ChooseCoinsScreen from './ChooseCoinsScreen';
import CreatePasscodeScreen from './CreatePasscodeScreen';
import PasscodeSuccessScreen from './PasscodeSuccessScreen';
import {PrepareWalletScreen} from './PrepareWalletScreen';

type TProps = RouteComponentProps<any>;

export class StartUpScreen extends React.Component<TProps> {
    public render(): JSX.Element {
        const {path} = this.props.match;
        return (
            <Switch>
                <Route path={`${path}`} exact component={WelcomeScreen}/>
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
