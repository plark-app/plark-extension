import React from 'react';
import cn from 'classnames';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import { KeyboardHandler } from 'Popup/SystemComponent';
import { Topic } from 'Popup/components/topic';

interface WelcomeLayoutProps extends React.HTMLProps<{}> {
    trackLabel: string;
    topicTitle?: string;

    className?: string;
    topicDescription?: string;
    onPressEnter?: () => void;
}

export const WelcomeLayout = (props: WelcomeLayoutProps) => {
    const { topicTitle, topicDescription } = props;

    return (
        <div className={cn('startup', props.className)}>
            <TrackScreenView trackLabel={props.trackLabel} />

            {props.onPressEnter && <KeyboardHandler onPressEnter={props.onPressEnter} />}
            {topicTitle && <Topic title={topicTitle} desc={topicDescription} />}

            {props.children}
        </div>
    );
};
