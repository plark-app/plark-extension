import React from 'react';
import {TransactionStatus} from "Core/Service/Wallet";

interface IProps {
    status: string
}

interface IState {
}

export default class Badge extends React.Component<IProps, IState> {
    render(): React.ReactNode {
        let label: string,
            badgeClass: string;

        const {status} = this.props;

        switch (status) {
            case TransactionStatus.Confirmed:
                label = 'Confirmed';
                badgeClass = '-success';
                break;

            case TransactionStatus.Pending:
                label = 'Pending';
                badgeClass = '-warning';
                break;

            case TransactionStatus.Rejected:
                label = 'Rejected';
                badgeClass = '-error';
                break;
        }

        return (<div className={`badge ${badgeClass}`}>{label}</div>);
    }
}
