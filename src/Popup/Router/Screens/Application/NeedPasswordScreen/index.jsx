import React from 'react';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import EnterPasscodeModal from './EnterPasscodeModal';

export class PasscodeWrapper extends React.Component {
    render() {
        const {open = false} = this.props;

        const transitionGroupProps = {
            transitionName: '-animation',
            transitionEnterTimeout: 400,
            transitionLeaveTimeout: 400
        };

        return (
            <ReactCSSTransitionGroup {...transitionGroupProps}>
                {open ? <EnterPasscodeModal/> : null}
            </ReactCSSTransitionGroup>
        );
    }
}
