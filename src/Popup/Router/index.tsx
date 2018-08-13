import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Location, Action } from 'history';
import screenAddressHistory from 'Popup/ScreenAddressHistory';
import proxyStore, { getState } from 'Popup/Store';
import { ApplicationLayout } from 'Popup/UI/Layouts';
import { HomeScreen, ApplicationRootScreen, StartUpScreen } from 'Popup/Screens';
import { GlobalAction } from 'Core/Actions/Reducer';

screenAddressHistory.listen((location: Location, action: Action) => {
    const { Global } = getState();

    if (Global.walletReady) {
        proxyStore.dispatch({
            type: GlobalAction.SetLocation,
            path: location.pathname,
            context: {},
        });
    }
});

export class ApplicationRouter extends React.Component<any, any> {
    public componentWillMount(): void {
        this.trackRedirect();
    }

    protected trackRedirect(): void {
        const { Welcome, Global } = getState();

        if (!Global.walletReady) {
            screenAddressHistory.push(Welcome.location || '/startup');
            return;
        }

        const { location } = Global;

        if (location && location.path) {
            screenAddressHistory.push(location.path, location.context || {});
            return;
        }
    }

    public render(): JSX.Element {
        return (
            <ApplicationLayout>
                <Router history={screenAddressHistory}>
                    <Switch>
                        <Route path='/' component={HomeScreen} exact={true} />
                        <Route path='/app' component={ApplicationRootScreen} />
                        <Route path='/startup' component={StartUpScreen} />
                    </Switch>
                </Router>
            </ApplicationLayout>
        );
    }
}
