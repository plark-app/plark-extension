import React from 'react';
import classNames from 'classnames';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import {KeyboardHandler} from 'Popup/Router/SystemComponent';

export default class WelcomeLayout extends React.Component {
    render() {
        const {
            className,
            children,
            trackLabel,
            topicTitle,
            topicDescription,
            onPressEnter
        } = this.props;

        return (
            <div className={classNames('startup', className)}>
                <TrackScreenView trackLabel={trackLabel}/>
                {onPressEnter && <KeyboardHandler onPressEnter={onPressEnter}/>}

                {topicTitle ? (
                    <div className="topic">
                        <h1 className="topic__title">{topicTitle}</h1>
                        <p className="topic__desc">{topicDescription}</p>
                    </div>
                ) : null}

                {children}
            </div>
        );
    }
}