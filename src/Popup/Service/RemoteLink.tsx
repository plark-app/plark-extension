import React from 'react';
import {extensionInstance} from "Core/Extension";

interface IProps {
    to: string;
    className?: string;
}

interface IState {
}

export default class RemoteLink extends React.Component<IProps, IState> {
    onClickLink = () => {
        const {to} = this.props;

        extensionInstance.getTabs().create({url: to});
    };

    render() {
        const {children, className} = this.props;

        return <a onClick={this.onClickLink} className={className}>{children}</a>
    }
}