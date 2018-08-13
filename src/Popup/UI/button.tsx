import React from 'react';
import cn from 'classnames';
import { DotLoader } from './dot-loader';

import './button.scss';

export type IButtonProps = React.HTMLProps<any> & {
    isLight?: boolean;
    isOutline?: boolean;
    width?: number;
    loading?: boolean;
}

export const Button = (props: IButtonProps) => {
    const { className, children, width, ...elseProps } = props;

    const buttonComponentProps = {
        className: cn('btn', className, {
            '-light': props.isLight,
            '-loading': props.loading,
            '-outline': props.isOutline,
        }),
        type: props.type || 'submit',
        disabled: props.disabled || props.loading,
        style: {
            width: width ? `${width}px` : null,
        },
        ...elseProps,
    };

    return (
        <button {...buttonComponentProps}>
            {props.loading ? <DotLoader /> : children}
        </button>
    );
};
