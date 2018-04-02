import React from 'react';
import {AnalyticsObserver} from 'Popup/Service/Analytics';
import debug from 'debug';

const debugScreenView = debug('berrywallet:screen');

export default class TrackScreenView extends React.PureComponent {
    componentDidMount() {
        const {trackLabel} = this.props;
        if (!trackLabel) {
            return;
        }

        AnalyticsObserver.screenview(trackLabel);
        debugScreenView('Screen view %c' + trackLabel, 'color: blue;');
    }

    render() {
        return null;
    }
}
