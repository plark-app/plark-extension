import React from 'react';
import cn from 'classnames';

import './topic.scss';

export type TopicProps = {
    title: string | React.ReactNode;
    desc?: string | React.ReactNode;
    className?: string;
};

export const Topic = (props: TopicProps) => {
    const { title, desc } = props;

    return (
        <div className={cn('topic', props.className)}>
            <h1 className="topic__title">{title}</h1>
            {desc && <p className="topic__desc">{desc}</p>}
        </div>
    );
};
