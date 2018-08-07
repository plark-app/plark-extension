import React from 'react';
import cn from 'classnames';
import { DotLoader } from './DotLoader';

export type InputCheckProps = {
    type?: string;
    checked?: boolean;
    className?: string;
    disable?: boolean;
    isLoading?: boolean;

    [key: string]: any;
};

export class InputCheck extends React.PureComponent<InputCheckProps> {
    public render(): JSX.Element {
        const {
            type,
            checked = false,
            className = '',
            disable = false,
            isLoading = false,
            ...elseProps
        } = this.props;

        if (isLoading) {
            return (
                <div className={cn('input-check', '-loading', className)}>
                    <DotLoader />
                </div>
            );
        }

        const elementClass = cn('input-check', className, {
            '-disable': disable,
            '-checked': checked,
        });

        return (
            <div className={elementClass}>
                <input type={type} className="input-check__input" {...elseProps} />
                <div className={`input-check__item -${type}`} />
            </div>
        );
    }
}
