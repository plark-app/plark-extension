import React from 'react';
import {extractHtmlLegal} from 'Core/Legal';
import TrackScreenView from "Popup/Service/ScreenViewAnalitics";

interface IProvacyPolicyState {
    content?: string;
}

export class PrivacyPolicyScreen extends React.Component<any, IProvacyPolicyState> {

    public state: IProvacyPolicyState = {
        content: null
    };

    public async componentDidMount() {
        const content = await extractHtmlLegal('/views/privacy.md');

        this.setState(() => ({content: content}));
    };

    public render(): JSX.Element {
        return (
            <div className="scroll-wrapper">
                <TrackScreenView trackLabel="help-privacy"/>

                <div className="card">
                    <h1 className="title">Privacy Policy</h1>

                    <div dangerouslySetInnerHTML={{__html: this.state.content}} className="legal__content"/>
                </div>
            </div>
        );
    }
}
