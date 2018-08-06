import React from 'react';
import cn from 'classnames';
import { ModalRootComponent } from 'Popup/Modals';
import { Alert } from 'Popup/UI';

export interface IApplicationLayoutProps {
    children: any;
}

export interface IApplicationLayoutState {
    hidden: boolean;
}

export class ApplicationLayout extends React.Component<IApplicationLayoutProps, IApplicationLayoutState> {

    public state: IApplicationLayoutState = {
        hidden: true,
    };

    public componentDidCatch(error: Error): void {
        Alert.showAlert({
            message: error.message,
        });
    }

    public componentDidMount(): void {
        setTimeout(() => {
            this.setState({ hidden: false });
        }, 0);
    }

    public render(): JSX.Element {
        const containerClass = cn('application-body', this.state.hidden && '-hidden');

        return (
            <div className="application">
                <Alert.AlertRootComponent />
                <div className={containerClass}>{this.props.children}</div>
                <ModalRootComponent />
            </div>
        );
    }
}
