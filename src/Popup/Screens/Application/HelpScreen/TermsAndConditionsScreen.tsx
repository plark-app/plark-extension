import React from 'react';
import {extractHtmlLegal} from 'Core/Legal';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';

interface ITermsState {
    content: string;
}

export class TermsAndConditionsScreen extends React.Component<object, ITermsState> {

    public state: ITermsState = {
        content: null
    };

    public componentDidMount(): void {
        extractHtmlLegal('/views/terms.md').then((content: string) => {
            this.setState({content: content});
        })
    };

    public render(): JSX.Element {
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
