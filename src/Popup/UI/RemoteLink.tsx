import React from 'react';
import Extberry from 'extberry';

interface IRemoteLinkProps {
    to: string;
    className?: string;
}

export class RemoteLink extends React.Component<IRemoteLinkProps, any> {
    onClickLink = () => {
        const {to} = this.props;
        Extberry.openTab({url: to});
    };

    render() {
        const {children, className} = this.props;

        return <a onClick={this.onClickLink} className={className}>{children}</a>
    }
}