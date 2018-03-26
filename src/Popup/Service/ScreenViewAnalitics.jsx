import React from 'react';
import {AnalyticsObserver} from 'Popup/Service/Analytics';

export default class TrackScreenView extends React.PureComponent {
    componentDidMount() {
        const {trackLabel} = this.props;
        if (!trackLabel) {
            return;
        }

        AnalyticsObserver.screenview(trackLabel);
        console.log('Screen view %c' + trackLabel, 'color: blue;');
    }

    render() {
        return null;
    }
}
