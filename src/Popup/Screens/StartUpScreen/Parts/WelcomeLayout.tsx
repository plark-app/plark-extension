import React from 'react';
import classNames from 'classnames';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import {KeyboardHandler} from 'Popup/SystemComponent';

interface IWelcomeLayoutProps extends React.HTMLProps<{}> {
    trackLabel: string;
    topicTitle: string;
    topicDescription?: string;
    onPressEnter?: () => void;
}

export class WelcomeLayout extends React.PureComponent<IWelcomeLayoutProps> {

    protected renderTopic(): JSX.Element {
        const {topicTitle, topicDescription} = this.props;

        if (topicTitle) {
            return (
                <div className="topic">
                    <h1 className="topic__title">{topicTitle}</h1>
                    <p className="topic__desc">{topicDescription}</p>
                </div>
            )
        }

        return null;
    }

    protected renderEnterHandler(): JSX.Element {
        const {onPressEnter} = this.props;

        if (onPressEnter) {
            return <KeyboardHandler onPressEnter={onPressEnter}/>;
        }

        return null;
    }

    public render(): JSX.Element {
        return (
            <div className={classNames('startup', this.props.className)}>
                <TrackScreenView trackLabel={this.props.trackLabel}/>
                {this.renderEnterHandler()}
                {this.renderTopic()}
                {this.props.children}
            </div>
        );
    }
}