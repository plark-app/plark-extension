import React from 'react';
import {Button} from "Popup/Router/UIComponents";
import ReactSVG from 'react-svg';

export default class SuccessSeedStep extends React.Component {
    render() {
        const {toEnterPasscode} = this.props;
        return (
            <div>
                <ReactSVG path="/images/icons/tick.svg"
                          className="success-icon"
                          wrapperClassName="success-icon-wrapper"
                />
                <div className="topic success-topic">
                    <h1 className="topic__title">Passcode Reset is Successful!</h1>
                    <p className="topic__desc">Now you can create a new passcode</p>
                </div>
                <div className="center">
                    <Button onClick={toEnterPasscode}>Create new password</Button>
                </div>
            </div>
        );
    }
}
