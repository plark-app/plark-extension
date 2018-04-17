import React from 'react';
import {extensionInstance} from "Core/Extension";

interface IRemoteLinkProps {
    to: string;
    className?: string;
}

export class RemoteLink extends React.Component<IRemoteLinkProps, any> {
    onClickLink = () => {
        const {to} = this.props;
        extensionInstance.getTabs().create({url: to});
    };

    render() {
        const {children, className} = this.props;

        return <a onClick={this.onClickLink} className={className}>{children}</a>
    }
}