import React from 'react';
import {random} from 'lodash';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import {Button} from 'Popup/UI';
import Extberry from 'extberry';

import './feedback.scss';

const images = ['/images/feedback-1.png', '/images/feedback-2.png'];

interface IFeedbackState {
    image: string;
}

export class FeedbackScreen extends React.PureComponent<null, IFeedbackState> {

    public readonly state: IFeedbackState = {
        image: images[random(0, 1, false)]
    };

    protected onClick = () => {
        Extberry.openTab({
            url: 'https://goo.gl/forms/UNtEZ43apDgfmAq52'
        });
    };

    public render(): JSX.Element {
        return (
            <div className="card -full-size feedback">
                <TrackScreenView trackLabel="help-feedback"/>

                <h1 className="title">Send Feedback</h1>
                <p className="text-center text-light">
                    We would be delighted to hear from you, so send us your feedback and we'll get back to you.
                </p>
                <img className="feedback-image" src={this.state.image}/>
                <Button className="feedback-button" onClick={this.onClick}>Compose report</Button>
            </div>
        );
    }
}
