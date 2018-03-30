import React from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {alertObserver, IAlert} from './Observer';
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
        alertObserver.onShow(this.handleAlertShow);
        alertObserver.onClose(this.handleAlertClose);
    }

    handleAlertShow = (alertToShow: IAlert) => {
        const {alert} = this.state;
        if (alert) {
            return;
        }

        alertToShow.tokenToClear = setTimeout(() => {
            alertObserver.close();
        }, alertToShow.lifetime);

        this.setState(() => {
            return {
                alert: alertToShow
            };
        });
    };

    handleAlertClose = () => {
        const {alert} = this.state;

        if (!alert) {
            return;
        }

        alert.tokenToClear && clearTimeout(alert.tokenToClear);
        alert.onClose && alert.onClose();

        this.setState(() => {
            return {
                alert: null
            };
        });
    };

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
            className: classNames(
                "alert-container",
                alert && {
                    '-active': true,
                    '-no-body': alert.noBody
                }
            )
        };

        return (
            <ReactCSSTransitionGroup {...transitionGroupProps}>
                {this.renderAlertComponent()}
            </ReactCSSTransitionGroup>
        );
    };
}
