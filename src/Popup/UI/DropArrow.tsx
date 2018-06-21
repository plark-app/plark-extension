import React from 'react';
import ReactSVG from 'react-svg';
import classNames from 'classnames';
import './drop-arrow.scss';

export interface IDropDOwnProps {
    active?: boolean;
    className?: any;
    wrapperClassName?: any;
}

export class DropArrow extends React.PureComponent<IDropDOwnProps, any> {
    public render(): JSX.Element {

        const {className, wrapperClassName, active = false} = this.props;

        return (
            <ReactSVG
                path={`/images/icons/drop-arrow.svg`}
                className={classNames('drop-arrow', active && '-active', className)}
                wrapperClassName={classNames("drop-arrow-wrapper", wrapperClassName)}
                style={{width: 8, height: 5}}
            />
        )
    }
}