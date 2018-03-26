import React from 'react';
import classNames from 'classnames';
import {Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import {filter} from 'lodash';

import MenuLayout from "Popup/Router/Layouts/MenuLayout";

import TutorialScreen from "Popup/Router/Screens/Application/HelpScreen/TutorialScreen";
import FAQScreen from "Popup/Router/Screens/Application/HelpScreen/FAQScreen";
import FeedbackScreen from "Popup/Router/Screens/Application/HelpScreen/FeedbackScreen";
import ContactsScreen from "Popup/Router/Screens/Application/HelpScreen/ContactsScreen";
import PrivacyPolicyScreen from "Popup/Router/Screens/Application/HelpScreen/PrivacyPolicyScreen";
import TermsAndConditionsScreen from "Popup/Router/Screens/Application/HelpScreen/TermsAndConditionsScreen";
import VersionScreen from "Popup/Router/Screens/Application/HelpScreen/VersionScreen";

const links = [
    {
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
    }
];

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
