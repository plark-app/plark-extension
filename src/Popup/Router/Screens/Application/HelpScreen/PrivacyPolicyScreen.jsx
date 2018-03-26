import React from 'react';
import {extractHtmlLegal} from 'Core/Legal';
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";

export default class PrivacyPolicyScreen extends React.Component {

    state = {
        content: null
    };

    componentDidMount() {
        extractHtmlLegal('/views/privacy.md').then((content) => {
            this.setState(() => ({content: content}));
        })
    };

    render() {
        return (
            <div className="scroll-wrapper">
                <TrackScreenView trackLabel="help-privacy"/>

                <div className="card">
                    <h1 className="title">Privacy Policy</h1>

                    <div
                        dangerouslySetInnerHTML={{__html: this.state.content}}
                        className="legal__content"
                    />
                </div>
            </div>
        );
    }
}
