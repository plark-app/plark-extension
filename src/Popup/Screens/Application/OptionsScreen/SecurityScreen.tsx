import React from 'react';
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";

// @TODO Need implement interfaces of SecurityProps ans SecurityState
export class SecurityScreen extends React.Component<any, any> {
    render(): JSX.Element {
        return (
            <div className="card -full-size">
                <TrackScreenView trackLabel="option-security"/>

                <h1 className="title">Security Berrywallet</h1>
                <div className="reset-content"/>
            </div>
        );
    }
}
