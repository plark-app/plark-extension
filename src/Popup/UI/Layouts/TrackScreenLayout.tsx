import React from 'react';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';

type TrackScreenProps = {
    trackLabel?: string;
    [key: string]: any;
};

export const TrackScreenLayout = (props: TrackScreenProps) => {
    const { children, trackLabel, ...elseProps } = props;

    return (
        <div {...elseProps}>
            <TrackScreenView trackLabel={trackLabel} />
            {children}
        </div>
    );
}
