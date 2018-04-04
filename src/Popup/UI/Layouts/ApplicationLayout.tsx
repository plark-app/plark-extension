import React from 'react';
import {ModalRootComponent} from "Popup/Router/Modals";
import {AlertRootComponent, showAlert} from "Popup/Router/Alert";

export interface IApplicationLayoutProps {
    children: any;
}

export class ApplicationLayout extends React.Component<IApplicationLayoutProps, any> {
    componentDidCatch(error: Error) {
        showAlert({
            message: error.message
        });
    }

    render() {
        return (
            <div className="application">
                <AlertRootComponent/>
                <div className="application-body">{this.props.children}</div>
                <ModalRootComponent/>
            </div>
        )
    }
}