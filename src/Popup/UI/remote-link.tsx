import React from 'react';
import Extberry from 'extberry';

type RemoteLinkProps = {
    to: string;
    className?: string;
};

export class RemoteLink extends React.PureComponent<RemoteLinkProps> {
    protected onClickLink = () => {
        const { to } = this.props;

        Extberry.openTab({ url: to });
    };

    public render(): JSX.Element {
        const { children, className } = this.props;

        return <a onClick={this.onClickLink} className={className}>{children}</a>;
    }
}
