import React from 'react';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';

export class TutorialScreen extends React.Component {
    public render(): JSX.Element {
        return (
            <div className="card tutorial">
                <TrackScreenView trackLabel="help-tutorial"/>

                <h1 className="title">Tutorial</h1>
            </div>
        );
    }
}
