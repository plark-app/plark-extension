import React from 'react';
import classNames from 'classnames';
import {DotLoader} from "./DotLoader";
import './button.scss';

export interface IButtonProps extends React.HTMLProps<any> {
    isLight?: boolean;
    isOutline?: boolean;
    width?: number;
    loading?: boolean;
}

export class Button extends React.PureComponent<IButtonProps> {
    public render(): JSX.Element {
        const {
            className,
            children,
            width,
            ...elseProps
        } = this.props;

        const buttonComponentProps = {
            className: classNames('btn', className, {
                '-light': this.props.isLight,
                '-loading': this.props.loading,
                '-outline': this.props.isOutline
            }),
            type: this.props.type || 'submit',
            disabled: this.props.disabled || this.props.loading,
            style: {
                width: width ? `${width}px` : null
            },
            ...elseProps
        };

        return (
            <button {...buttonComponentProps}>
                {this.props.loading ? <DotLoader/> : children}
            </button>
        );
    }
}
