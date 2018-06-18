import React from 'react';
import {ModalInfoInterface, modalList, ModalType} from "./ModalTypes";
import {modalObserverInstance} from './Observer';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

interface IModalProps {
}

interface IModalState {
    modalType?: ModalType;
    modalProps: object;
}

export class ModalRootComponent extends React.Component<IModalProps, IModalState> {

    state: IModalState = {
        modalType: null,
        modalProps: {}
    };

    componentDidMount() {
        modalObserverInstance.setRootComponent(this);
    }

    renderModalComponent() {
        const {modalType = null, modalProps = {}} = this.state;

        if (!modalType) {
            return null;
        }

        const modalInfo: ModalInfoInterface = modalList[modalType] || null;

        if (!modalType) {
            return null;
        }

        const CurrentModalComponent = modalInfo.component;

        return <CurrentModalComponent {...modalProps} />;
    }

    render(): React.ReactNode {
        const transitionGroupProps = {
            transitionName: '-animation',
            transitionEnterTimeout: 400,
            transitionLeaveTimeout: 400
        };

        return (
            <ReactCSSTransitionGroup {...transitionGroupProps}>
                {this.renderModalComponent()}
            </ReactCSSTransitionGroup>
        );
    };
}
