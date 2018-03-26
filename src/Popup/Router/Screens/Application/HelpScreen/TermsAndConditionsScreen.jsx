import React from 'react';
import {extractHtmlLegal} from 'Core/Legal';
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";

export default class TermsAndConditionsScreen extends React.Component {

    state = {
        content: null
    };

    componentDidMount() {
        extractHtmlLegal('/views/terms.md').then((content) => {
            this.setState(() => {
                return {
                    content: content
                };
            });
        })
    };

    render() {
        return (
            <div className="scroll-wrapper">
                <TrackScreenView trackLabel="help-terms"/>

                <div className="card">
                    <h1 className="title">Terms & Conditions</h1>

                    <div
                        dangerouslySetInnerHTML={{__html: this.state.content}}
                        className="legal__content"
                    />
                </div>
            </div>
        );
    }
}
