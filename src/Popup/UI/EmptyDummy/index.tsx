import React from 'react';
import classNames from "classnames";

import './empty-dummy.scss';

export interface IEmptyDummyProps {
    title?: string;
    description?: string;
    show?: boolean;
}

export class EmptyDummy extends React.Component<IEmptyDummyProps> {
    public render(): JSX.Element {
        const {title = '', description = '', show = false} = this.props;

        return (
            <div className={classNames('empty-dummy', {'-active': show})}>
                <div className="empty-dummy__thinker">{"🤔"}</div>
                {title ? <div className="empty-dummy__title">{title}</div> : null}
                {description ? <div className="empty-dummy__desc">{description}</div> : null}
            </div>
        );
    }
}
