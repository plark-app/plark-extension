import React from 'react';
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";

export class TrackScreenLayout extends React.Component<any, any> {
    render() {
        const {children, trackLabel, ...props} = this.props;

        return <div {...props}>
            <TrackScreenView trackLabel={trackLabel}/>
            {children}
        </div>
    }
}