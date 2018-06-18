import React from 'react';
import classNames from 'classnames';

export interface INotFoundOwnProps {
    title?: string;
    description?: string;
    show?: boolean;
}

export class NotFoundComponent extends React.Component<INotFoundOwnProps> {
    public render(): JSX.Element {
        const {title = '', description = '', show = false} = this.props;

        return (
            <div className={classNames('currency-not-found', {'-active': show})}>
                <div className="currency-not-found__thinker">{"🤔"}</div>
                {title ? <div className="currency-not-found__title">{title}</div> : null}
                {description ? <div className="currency-not-found__desc">{description}</div> : null}
            </div>
        );
    }
}
