import React from 'react';
import cn from 'classnames';
import './legal.scss';

type LegalContentProps = {
    children: string;
    className?: string;
};

export const LegalContent = (props: LegalContentProps) => (
    <div className={cn('legal-content', props.className)} dangerouslySetInnerHTML={{ __html: props.children }} />
);
