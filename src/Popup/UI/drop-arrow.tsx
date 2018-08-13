import React from 'react';
import ReactSVG from 'react-svg';
import cn from 'classnames';

import './drop-arrow.scss';

export type DropDownProps = {
    active?: boolean;
    className?: any;
    wrapperClassName?: any;
}

export const DropArrow = ({ className, wrapperClassName, active = false }: DropDownProps) => (
    <ReactSVG
        path={`/images/icons/drop-arrow.svg`}
        className={cn('drop-arrow', active && '-active', className)}
        wrapperClassName={cn("drop-arrow-wrapper", wrapperClassName)}
        style={{ width: 8, height: 5 }}
    />
);
