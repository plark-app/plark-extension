import React from 'react';
import {Button} from "Popup/Router/UIComponents";
import ReactSVG from 'react-svg';

export default class SuccessPasscodeStep extends React.Component {
    render() {
        const {onGotIt} = this.props;

        return (
            <div>
                <ReactSVG path="/images/icons/tick.svg"
                          className="success-icon"
                          wrapperClassName="success-icon-wrapper"
                />
                <div className="topic success-topic">
                    <h1 className="topic__title">New Passcode Has Been<br/>Created Successfully</h1>
                </div>
                <div className="center">
                    <Button onClick={onGotIt}>Got it!</Button>
                </div>
            </div>
        );
    }
}
