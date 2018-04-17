import React from 'react';
import classNames from 'classnames';
import {DotLoader} from "./DotLoader";
import './button.scss';

export interface IButtonProps extends React.HTMLProps<any> {
    isLight?: boolean;
    width?: number;
    loading?: boolean;
}

export class Button extends React.PureComponent<IButtonProps, any> {
    render() {
        const {
            className,
            children,
            type,
            isLight = false,
            loading = false,
            width,
            disabled = false,
            ...elseProps
        } = this.props;

        const buttonComponentProps = {
            className: classNames('btn', className, isLight && '-light', loading && '-loading'),
            type: type ? type : 'submit',
            disabled: disabled || loading,
            style: {
                width: width ? `${width}px` : null
            },
            ...elseProps
        };

        return (
            <button {...buttonComponentProps}>
                {loading ? <DotLoader/> : children}
            </button>
        );
    }
}
