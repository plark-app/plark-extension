import React from 'react';
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";

export class VersionScreen extends React.Component {
    render() {
        return (
            <div className="card version">
                <TrackScreenView trackLabel="help-version"/>

                <h1 className="title">About</h1>
            </div>
        );
    }
}
