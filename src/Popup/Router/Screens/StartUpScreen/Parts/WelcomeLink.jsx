import React from 'react';
import {connect} from 'react-redux';
import screenHistory from 'Popup/ScreenAddressHistory';

import {mapWelcomeDispatchers} from 'Popup/Store/KeyringConnector';

@connect(null, mapWelcomeDispatchers)
export default class WelcomeLink extends React.Component {

    isDisabled() {
        return this.props.disabled || false;
    }

    handleOnClick = (event) => {
        if (this.isDisabled()) {
            return false;
        }

        const {onClick} = this.props;

        if (typeof onClick === 'function') {
            let result = onClick(event);
            if (false === result) return;
        }

        const {to, welcomeLocation = null} = this.props;

        screenHistory.push(to);
        this.props.setWelcomeLocation(to);
    };

    render() {
        const componentProps = {
            className: this.props.className,
            onClick: this.handleOnClick,
            disabled: this.isDisabled()
        };

        return <button {...componentProps}>{this.props.children}</button>;
    }
}
