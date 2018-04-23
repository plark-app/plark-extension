import React from 'react';
import classNames from 'classnames';
import {ModalRootComponent} from "Popup/Router/Modals";
import {Alert} from 'Popup/UI';

export interface IApplicationLayoutProps {
    children: any;
}

export interface IApplicationLayoutState {
    hidden: boolean;
}

export class ApplicationLayout extends React.Component<IApplicationLayoutProps, IApplicationLayoutState> {

    public state: IApplicationLayoutState = {
        hidden: true
    };

    componentDidCatch(error: Error) {
        Alert.showAlert({
            message: error.message
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState(() => ({hidden: false}));
        }, 0);
    }

    render() {
        return (
            <div className="application">
                <Alert.AlertRootComponent/>
                <div
                    className={classNames("application-body", this.state.hidden && "-hidden")}>{this.props.children}</div>
                <ModalRootComponent/>
            </div>
        )
    }
}