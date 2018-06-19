import React from 'react';
import cn from 'classnames';
import {SlideLeft} from 'svg';

import './action-list.scss';

export interface UIActionItem extends React.HTMLProps<{}> {
    label: string;
}

export interface IActionListProps {
    actions: UIActionItem[];
}

export const ActionItem = (props: UIActionItem): JSX.Element => {
    const {label, onClick, className} = props;

    return (
        <div className={cn('action-item', className)} onClick={onClick}>
            <label className="action-item__label">{label}</label>
            <div className="action-item__control">
                <SlideLeft className="action-item__control-icon"/>
            </div>
        </div>
    );
};

export class ActionList extends React.PureComponent<IActionListProps> {
    public render(): JSX.Element {
        return (
            <div className="action-list">
                {this.props.actions.map((actionProps: UIActionItem, index: number) => (
                    <ActionItem {...actionProps} key={index}/>
                ))}
            </div>
        );
    }
}
