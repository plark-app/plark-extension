import React from 'react';
import {map} from 'lodash';
import {SendDataFooterRow, IFooterRowProps} from './';

export interface ISendFooterProps {
    footerRows: IFooterRowProps[];
}

export class FooterComponent extends React.Component<ISendFooterProps, any> {
    render() {
        const {footerRows = []} = this.props;

        return (
            <div className="send-footer">
                {map(footerRows, (rowProps: IFooterRowProps) => {
                    return <SendDataFooterRow {...rowProps}/>
                })}
            </div>
        );
    }
}