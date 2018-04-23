import 'Core/global-env.d.ts';

import React from 'react';
import {Provider} from 'react-redux';

import {ApplicationRouter} from './Router';
import proxyStore from './Store';
import {Analytics} from './Service';

interface IPopupApplicationState {
    ready: boolean;
}

export class PopupApplication extends React.Component<any, IPopupApplicationState> {
    state = {
        ready: false
    };

    componentDidCatch(error, info) {
        Analytics.exception(error, true);
    }

    componentDidMount() {
        proxyStore.ready(() => {
            setTimeout(() => {
                this.setState(() => ({ready: true}));
            }, 100);
        });
    }

    render() {
        if (false === this.state.ready) {
            return (
                <div className='application -loading'>
                    <div className="loading">Loading...</div>
                </div>
            );
        }

        return (
            <Provider store={proxyStore}>
                <ApplicationRouter/>
            </Provider>
        );
    }
}
