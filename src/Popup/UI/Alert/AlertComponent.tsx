import React from 'react';
import classNames from 'classnames';
import ReactSVG from 'react-svg';
import {alertObserver} from './Observer';

interface IAlertProps {
    message: string;
    type: string;
}

export class AlertComponent extends React.Component<IAlertProps> {

    protected onClose = () => {
        alertObserver.close();
    };

    public render(): JSX.Element {
        const {message, type} = this.props;
        const props = {
            className: classNames('alert', `-${type}`)
        };

        const noticeSvgIconProps = {
            path: `/images/icons/notice.svg`,
            className: "alert-notice",
            wrapperClassName: "alert-notice-wrapper",
            style: {width: 18, height: 18}
        };

        const closeSvgIconProps = {
            path: `/images/icons/close-round.svg`,
            className: "alert-close"
        };

        return (
            <div {...props}>
                {type === 'warning' && <ReactSVG {...noticeSvgIconProps}/>}
                <div className="alert-message">{message}</div>
                <div className="alert-close-wrapper" onClick={this.onClose}>
                    <ReactSVG {...closeSvgIconProps} />
                </div>
            </div>
        );
    };
}
