import React from 'react';
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";

export default class FAQScreen extends React.Component {
    render() {
        return (
            <div className="card faq">
                <TrackScreenView trackLabel="help-faq"/>

                <h1 className="title">FAQ</h1>
            </div>
        );
    }
}
