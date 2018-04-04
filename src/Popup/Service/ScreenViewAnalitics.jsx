import React from 'react';
import {AnalyticsObserver} from 'Popup/Service/Analytics';
import debug from 'debug';

const debugScreenView = debug('berrywallet:screen');

const trackScreenLabel = (trackLabel) => {
    if (!trackLabel) {
        return;
    }

    AnalyticsObserver.screenview(trackLabel);
    debugScreenView('Screen view %c' + trackLabel, 'color: blue;');
};

export default class TrackScreenView extends React.PureComponent {
    componentDidMount() {
        const {trackLabel} = this.props;

        trackScreenLabel(trackLabel);
    }

    componentDidUpdate(prevProps) {
        const trackLabel = this.props.trackLabel;
        const prevLabel = prevProps.trackLabel;

        if (trackLabel !== prevLabel) {
            trackScreenLabel(trackLabel);
        }
    }

    render() {
        return null;
    }
}
