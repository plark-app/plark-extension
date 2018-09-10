import React from 'react';
import { map } from 'lodash';
import { SendDataFooterRow, FooterRowProps } from './send-data-footer-row';

export type SendFooterProps = {
    footerRows: FooterRowProps[];
}

export const FooterComponent = (props: SendFooterProps) => {
    const { footerRows = [] } = props;

    return (
        <div className="send-footer">
            {map(footerRows, (rowProps: FooterRowProps) => (
                <SendDataFooterRow {...rowProps} />
            ))}
        </div>
    );
};
