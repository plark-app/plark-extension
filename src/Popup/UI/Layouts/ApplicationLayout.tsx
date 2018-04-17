import React from 'react';
import {ModalRootComponent} from "Popup/Router/Modals";
import {Alert} from 'Popup/UI';

export interface IApplicationLayoutProps {
    children: any;
}

export class ApplicationLayout extends React.Component<IApplicationLayoutProps, any> {
    componentDidCatch(error: Error) {
        Alert.showAlert({
            message: error.message
        });
    }

    render() {
        return (
            <div className="application">
                <Alert.AlertRootComponent/>
                <div className="application-body">{this.props.children}</div>
                <ModalRootComponent/>
            </div>
        )
    }
}