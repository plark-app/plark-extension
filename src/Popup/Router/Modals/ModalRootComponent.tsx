import React from 'react';
import {ModalInfoInterface, modalList, ModalType} from "./ModalTypes";
import {modalObserverInstance} from './Observer';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

interface IProps {
}

interface IState {
    modalType?: ModalType;
    modalProps: object;
}

export default class ModalRootComponent extends React.Component<IProps, IState> {

    state: IState = {
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
