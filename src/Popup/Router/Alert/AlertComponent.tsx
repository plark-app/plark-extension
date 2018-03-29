import React from 'react';
import classNames from 'classnames';

interface IAlertProps {
    message: string;
    type: string;
}

export class AlertComponent extends React.Component<IAlertProps, null> {

    render(): React.ReactNode {
        const {message, type} = this.props;
        const props = {
            className: classNames('alert', `-${type}`)
        };

        return (
            <div {...props}>{message}</div>
        );
    };
}
