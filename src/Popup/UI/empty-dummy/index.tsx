import React from 'react';
import cn from 'classnames';

import './empty-dummy.scss';

export type TEmptyDummyProps = {
    title?: string;
    description?: string;
    show?: boolean;
}

export const EmptyDummy = ({ title = '', description = '', show = false }: TEmptyDummyProps) => (
    <div className={cn('empty-dummy', { '-active': show })}>
        <div className="empty-dummy__thinker">{'🤔'}</div>
        {title ? <div className="empty-dummy__title">{title}</div> : null}
        {description ? <div className="empty-dummy__desc">{description}</div> : null}
    </div>
);

