import React from 'react';
import classNames from 'classnames';

export interface INoticeProps {
    show?: boolean;
    className: any;
    children: any;
}

export class Notice extends React.Component<INoticeProps, any> {
    render() {
        const {
            children,
            show = false,
            className
        } = this.props;

        return (
            <label className={classNames('notice', {'-hidden': !show}, className)}>
                {children}
            </label>
        );
    }
}
