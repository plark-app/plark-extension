import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import screenAddressHistory from 'Popup/ScreenAddressHistory';

import proxyStore, {getState} from 'Popup/Store';
import Application from 'Popup/Router/Screens/Application';
import HomeScreen from 'Popup/Router/Screens/HomeScreen';
import StartUpScreen from 'Popup/Router/Screens/StartUpScreen';

import {GlobalAction} from "Core/Actions/Reducer";
import {ModalRootComponent} from "./Modals";

screenAddressHistory.listen((location, action) => {
    const {Global} = getState();

    if (Global.walletReady) {
        proxyStore.dispatch({
            type: GlobalAction.SetLocation,
            path: location.pathname,
            context: {}
        });
    }
});

export default class ApplicationRouter extends React.Component {

    componentWillMount() {
        this.trackRedirect();
    }

    trackRedirect() {
        const {Welcome, Global} = getState();

        if (!Global.walletReady) {
            screenAddressHistory.push(Welcome.location || '/startup');
            return;
        }

        const {location} = Global;

        if (location && location.path) {
            screenAddressHistory.push(location.path, location.context || {});
            return;
        }
    }

    render() {
        return (
            <div className="application">
                <div className="application-body">
                    <Router history={screenAddressHistory}>
                        <Switch>
                            <Route exact={true} path='/' component={HomeScreen}/>
                            <Route path='/app' component={Application}/>
                            <Route path='/startup' component={StartUpScreen}/>
                        </Switch>
                    </Router>
                </div>
                <ModalRootComponent/>
            </div>
        );
    }
}
