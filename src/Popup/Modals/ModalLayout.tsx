import React from 'react';
import classNames from 'classnames';
import { closeModal } from './observer';

type CloseEvent = () => {};

interface IProps {
    withClose?: boolean;
    onClose?: CloseEvent;
    className?: string;
}

interface IState {
    show: boolean;
}

export class ModalLayout extends React.Component<IProps, IState> {

    public state: IState = {
        show: false,
    };

    public static defaultProps: IProps = {
        withClose: true,
        onClose: null,
    };

    protected onClose = (event) => {
        const { onClose = null } = this.props;
        onClose && onClose();
        closeModal();
    };

    public render(): React.ReactNode {
        const { className = null } = this.props;

        return (
            <div className="modal">
                <div className="modal-overlay" />
                {this.props.withClose ? <button tabIndex={1} onClick={this.onClose} className="modal-close" /> : null}
                <div className={classNames("modal-content", className)}>{this.props.children}</div>
            </div>
        );
    }
}
