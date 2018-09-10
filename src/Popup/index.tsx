import React from 'react';
import { Provider } from 'react-redux';

import { delay } from 'Core/utils';
import { ApplicationRouter } from './Router';
import proxyStore from './Store';
import { Analytics } from './Service';
import { BerrywalletLogo } from 'svg';


interface IPopupApplicationState {
    ready: boolean;
}

export class PopupApplication extends React.Component<object, IPopupApplicationState> {
    public state: IPopupApplicationState = {
        ready: false,
    };

    public componentDidCatch(error, info): void {
        Analytics.exception(error, true);
    }

    public async componentDidMount(): Promise<void> {
        await proxyStore.ready();
        await delay(200);

        this.setState({ ready: true });
    }

    public render(): JSX.Element {
        if (false === this.state.ready) {
            return (
                <div className='application -loading'>
                    <div className="loading">
                        <BerrywalletLogo className="loading__logo" />
                    </div>
                </div>
            );
        }

        return (
            <Provider store={proxyStore}>
                <ApplicationRouter />
            </Provider>
        );
    }
}
