import React from 'react';
import cn from 'classnames';
import { SlideRight } from 'svg';

import './action-list.scss';

export interface UIActionItem extends React.HTMLProps<{}> {
    label: string;
}

export const ActionItem = (props: UIActionItem): JSX.Element => {
    const { label, onClick, className } = props;

    return (
        <div className={cn('action-item', className)} onClick={onClick}>
            <label className="action-item__label">{label}</label>
            <div className="action-item__control">
                <SlideRight className="action-item__control-icon" />
            </div>
        </div>
    );
};

export interface IActionListProps {
    actions: UIActionItem[];
}

export const ActionList = (props: IActionListProps) => (
    <div className="action-list">
        {props.actions.map((actionProps: UIActionItem, index: number) => (
            <ActionItem {...actionProps} key={index} />
        ))}
    </div>
);
