import React from 'react';
import {Route, Switch} from 'react-router-dom';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {filter} from 'lodash';

import {MenuLayout} from 'Popup/UI/Layouts';

import {FAQScreen} from "./FAQScreen";
import {VersionScreen} from "./VersionScreen";
import {TutorialScreen} from "./TutorialScreen";
import {FeedbackScreen} from "./FeedbackScreen";
import {ContactsScreen} from "./ContactsScreen";
import {PrivacyPolicyScreen} from "./PrivacyPolicyScreen";
import {TermsAndConditionsScreen} from "./TermsAndConditionsScreen";

const links = [{
    path: '/app/help',
    name: 'Tutorial',
    isExact: true,
    isStrict: true,
    component: TutorialScreen,
    disabled: true
}, {
    path: '/app/help/faq',
    name: 'FAQ',
    component: FAQScreen,
    disabled: true
}, {
    path: '/app/help/feedback',
    name: 'Feedback',
    component: FeedbackScreen,
    disabled: true
}, {
    path: '/app/help',
    isExact: true,
    isStrict: true,
    // @TODO It's temporary added like a main link /app/help/contacts

    // path: '/app/help/contacts',
    name: 'Contacts',
    component: ContactsScreen
}, {
    path: '/app/help/privacy-policy',
    name: 'Privacy',
    component: PrivacyPolicyScreen
}, {
    path: '/app/help/terms-conditions',
    name: 'Terms',
    component: TermsAndConditionsScreen
}, {
    path: '/app/help/version-history',
    name: 'About',
    component: VersionScreen,
    disabled: true
}];

@connect(null)
export default class HelpScreen extends React.Component {
    state = {
        loaded: false
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState(() => ({loaded: true}));
        }, 0);
    }

    render() {

        const enabledLinks = filter(links, (item) => {
            return !item.disabled;
        });

        return (
            <div className="page-wrapper">
                <MenuLayout
                    containerClassName={classNames('page-nav', {'-loaded': this.state.loaded})}
                    itemClassName="page-nav__item"
                    links={enabledLinks}
                    maskKey="help"
                    svgStyle={{borderRadius: "3px"}}
                    isSmall={true}
                />
                <div className="page-content">
                    <Switch>
                        {enabledLinks.map((link, indx) => {
                            return <Route
                                key={indx}
                                exact={link.isExact || false}
                                path={link.path}
                                component={link.component || null}
                            />
                        })}
                    </Switch>
                </div>
            </div>
        );
    }
}
