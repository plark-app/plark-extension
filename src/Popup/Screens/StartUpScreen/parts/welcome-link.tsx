import React from 'react';
import { connect } from 'react-redux';
import screenHistory from 'Popup/ScreenAddressHistory';
import { mapWelcomeDispatchers, IWelcomeDispatcher } from 'Popup/Store/keyring-connector';

interface WelcomeLinkProps extends IWelcomeDispatcher, React.HTMLProps<{}> {
    to: string;
    welcomeLocation?: string;
}

class WelcomeLinkComponent extends React.Component<WelcomeLinkProps> {

    protected isDisabled(): boolean {
        return this.props.disabled || false;
    }

    protected handleOnClick = (event): void => {
        if (this.isDisabled()) {
            return;
        }

        const { onClick } = this.props;

        if (typeof onClick === 'function') {
            try {
                onClick(event);
            } catch (e) {
                return;
            }
        }

        const { to, welcomeLocation = null } = this.props;

        screenHistory.push(to);
        this.props.setWelcomeLocation(to);
    };

    public render(): JSX.Element {
        const componentProps = {
            className: this.props.className,
            onClick: this.handleOnClick,
            disabled: this.isDisabled(),
        };

        return <button {...componentProps}>{this.props.children}</button>;
    }
}

export const WelcomeLink = connect(null, mapWelcomeDispatchers)(WelcomeLinkComponent);
