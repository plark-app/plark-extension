import React from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {alertManager, IAlert} from './Observer';
import {AlertComponent} from "./AlertComponent";

interface IModalProps {
}

interface IAlertState {
    alert?: IAlert;
}

export class AlertRootComponent extends React.Component<IModalProps, IAlertState> {

    state: IAlertState = {
        alert: null
    };

    componentDidMount() {
        alertManager.setRootComponent(this);
    }

    renderAlertComponent() {
        const {alert} = this.state;
        if (!alert) {
            return null;
        }

        const alertProps = {
            key: `alert-${alert.time}`,
            ...alert
        };

        return <AlertComponent {...alertProps} />;
    }

    render(): React.ReactNode {
        const {alert} = this.state;
        const transitionGroupProps = {
            transitionName: '-animation',
            transitionEnterTimeout: 400,
            transitionLeaveTimeout: 400,
            className: classNames("alert-container", alert && '-active')
        };

        return (
            <ReactCSSTransitionGroup {...transitionGroupProps}>
                {this.renderAlertComponent()}
            </ReactCSSTransitionGroup>
        );
    };
}
