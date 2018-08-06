import React from 'react';
import cn from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { alertObserver, IAlert } from './observer';
import { AlertComponent } from './alert-component';

interface IModalProps {
}

interface IAlertState {
    alert?: IAlert;
}

export class AlertRootComponent extends React.Component<IModalProps, IAlertState> {

    public state: IAlertState = {
        alert: null,
    };

    public componentDidMount(): void {
        alertObserver.onShow(this.handleAlertShow);
        alertObserver.onClose(this.handleAlertClose);
    }

    protected handleAlertShow = (alertToShow: IAlert) => {
        const { alert } = this.state;
        if (alert) {
            return;
        }

        alertToShow.tokenToClear = setTimeout(() => {
            alertObserver.close();
        }, alertToShow.lifetime);

        this.setState(() => {
            return {
                alert: alertToShow,
            };
        });
    };

    protected handleAlertClose = () => {
        const { alert } = this.state;

        if (!alert) {
            return;
        }

        alert.tokenToClear && clearTimeout(alert.tokenToClear);
        alert.onClose && alert.onClose();

        this.setState(() => {
            return {
                alert: null,
            };
        });
    };

    public render(): JSX.Element {
        const { alert } = this.state;

        const alertContainerClass = cn(
            'alert-container',
            alert && {
                '-active': true,
                '-no-body': alert.noBody,
            },
        );

        return (
            <TransitionGroup className={alertContainerClass}>
                {alert && (
                    <CSSTransition key={`alert-${alert.time}`} classNames="-animation" timeout={400}>
                        <AlertComponent {...alert} />
                    </CSSTransition>
                )}
            </TransitionGroup>
        );
    };
}
