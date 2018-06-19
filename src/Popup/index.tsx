import 'Core/global-env.d.ts';

import React from 'react';
import {Provider} from 'react-redux';

import {ApplicationRouter} from './Router';
import proxyStore from './Store';
import {Analytics} from './Service';

interface IPopupApplicationState {
    ready: boolean;
}

export class PopupApplication extends React.Component<{}, IPopupApplicationState> {
    public state: IPopupApplicationState = {
        ready: false
    };

    public componentDidCatch(error, info): void {
        Analytics.exception(error, true);
    }

    public componentDidMount(): void {
        proxyStore.ready(() => {
            setTimeout(() => {
                this.setState(() => ({ready: true}));
            }, 100);
        });
    }

    public render(): JSX.Element {
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
