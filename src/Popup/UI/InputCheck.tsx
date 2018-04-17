import React from 'react';
import classNames from 'classnames';
import {DotLoader} from './DotLoader';

export interface InputCheckProps {
    type?: string;
    checked?: boolean;
    className?: string;
    disable?: boolean;
    isLoading?: boolean;

    [key: string]: any;
}

export class InputCheck extends React.PureComponent<InputCheckProps, any> {

    render() {
        const {
            type,
            checked = false,
            className = '',
            disable = false,
            isLoading = false,
            ...elseProps
        } = this.props;

        if (isLoading) {
            return <div className={classNames('input-check', '-loading', className)}>
                <DotLoader/>
            </div>
        }

        const elementClass = classNames('input-check', className, {
            '-disable': disable,
            '-checked': checked
        });

        return (<div className={elementClass}>
            <input type={type} className="input-check__input" {...elseProps}/>
            <div className={`input-check__item -${type}`}/>
        </div>);
    }
}
