import React from 'react';
import {Provider} from 'react-redux';
import {ApplicationRouter} from 'Popup/Router';
import proxyStore from 'Popup/Store'
import {AnalyticsObserver} from "./Service/Analytics";

interface PopupApplicationStateInterface {
    ready: boolean
}

export default class PopupApplication extends React.Component<any, PopupApplicationStateInterface> {
    state = {
        ready: false
    };

    componentDidCatch(error, info) {
        AnalyticsObserver.exception(error, true);
    }

    componentDidMount() {
        proxyStore.ready(() => {
            setTimeout(() => {
                this.setState(() => ({ready: true}));
            }, 0)
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
