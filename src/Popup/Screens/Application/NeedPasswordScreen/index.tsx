import React from 'react';
import {TransitionGroup, CSSTransition} from "react-transition-group";
import EnterPasscodeModal from './EnterPasscodeModal';

interface IProps {
    open: boolean;
}

export class PasscodeWrapper extends React.Component<IProps> {
    public render(): JSX.Element {
        const {open = false} = this.props;

        return (
            <CSSTransition in={open} classNames="-animation" timeout={400} unmountOnExit>
                <EnterPasscodeModal />
            </CSSTransition>
        );
    }
}
