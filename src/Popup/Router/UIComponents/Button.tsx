import React from 'react';
import classNames from 'classnames';

export interface IButtonProps extends React.HTMLProps<any> {
}

export class Button extends React.PureComponent<IButtonProps, any> {
    render() {
        const {
            className,
            children,
            type,
            ...elseProps
        } = this.props;

        const buttonComponentProps = {
            className: classNames('btn', className),
            type: type ? type : 'submit',

            ...elseProps
        };

        return <button {...buttonComponentProps}>{children}</button>;
    }
}
