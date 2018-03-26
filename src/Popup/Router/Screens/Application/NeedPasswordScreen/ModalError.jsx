import React from 'react';
import ReactSVG from 'react-svg';

export default class ModalError extends React.Component {

    onCloseModalError = (event) => {
        const {onCloseError = null} = this.props;

        onCloseError && onCloseError(event);
    };

    render() {
        const {errorMessage = ''} = this.props;

        const noticeSvgIconProps = {
            path: `/images/icons/notice.svg`,
            className: "modal-error-notice",
            wrapperClassName: "modal-error-notice-wrapper",
            style: {width: 18, height: 18}
        };

        const closeSvgIconProps = {
            path: `/images/icons/close-round.svg`,
            className: "modal-error-close"
        };

        return (
            <div className="modal-error alert">
                <ReactSVG {...noticeSvgIconProps}/>
                <div className="modal-error-message">{errorMessage}</div>
                <div className="modal-error-close-wrapper" onClick={this.onCloseModalError}>
                    <ReactSVG {...closeSvgIconProps} />
                </div>
            </div>
        )
    }
}