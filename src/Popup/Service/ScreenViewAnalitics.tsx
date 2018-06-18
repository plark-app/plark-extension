import React from 'react';
import {Analytics} from 'Popup/Service';


const trackScreenLabel = (trackLabel: string) => {
    if (!trackLabel) {
        return;
    }

    Analytics.screenview(trackLabel);
};

export interface ITrackScreenViewProps {
    trackLabel: string;
}

export default class TrackScreenView extends React.PureComponent<ITrackScreenViewProps, any> {
    public componentDidMount(): void {
        const {trackLabel} = this.props;

        trackScreenLabel(trackLabel);
    }

    public componentDidUpdate(prevProps: ITrackScreenViewProps): void {
        const trackLabel = this.props.trackLabel;
        const prevLabel = prevProps.trackLabel;

        if (trackLabel !== prevLabel) {
            trackScreenLabel(trackLabel);
        }
    }

    public render(): JSX.Element {
        return null;
    }
}
