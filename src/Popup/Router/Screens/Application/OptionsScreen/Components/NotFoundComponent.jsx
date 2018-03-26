import React from 'react';
import classNames from 'classnames';

export default class NotFoundComponent extends React.Component {
    render() {
        const {title = '', description = '', show = false} = this.props;

        return (
            <div className={classNames("currency-not-found", {'-active': show})}>
                <div className="currency-not-found__thinker">{"🤔"}</div>
                <div className="currency-not-found__title">{title}</div>
                <div className="currency-not-found__desc">{description}</div>
            </div>
        );
    }
}
