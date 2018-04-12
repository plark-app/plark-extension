import React from 'react';
import {TransactionStatus} from "Core/Service/Wallet";
import "./badge.scss";

export interface IBadgeProps {
    status: string
}

export class Badge extends React.Component<IBadgeProps, any> {
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
