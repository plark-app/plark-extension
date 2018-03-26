import React from 'react';
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";

export default class FeedbackScreen extends React.Component {
    render() {
        return (
            <div className="card feedback">
                <TrackScreenView trackLabel="help-feedback"/>

                <h1 className="title">Send Feedback</h1>
            </div>
        );
    }
}
