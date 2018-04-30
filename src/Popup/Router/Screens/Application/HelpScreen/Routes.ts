import {ComponentType} from 'react';
import {FAQScreen} from "./FAQScreen";
import {VersionScreen} from "./VersionScreen";
import {TutorialScreen} from "./TutorialScreen";
import {FeedbackScreen} from "./FeedbackScreen";
import {ContactsScreen} from "./ContactsScreen";
import {PrivacyPolicyScreen} from "./PrivacyPolicyScreen";
import {TermsAndConditionsScreen} from "./TermsAndConditionsScreen";

export interface IRouteElement {
    path: string;
    name: string;
    component: ComponentType;
    disabled?: boolean;
}

export const routerElements: IRouteElement[] = [{
    path: '/app/help/tutorial',
    name: 'Tutorial',
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
    path: '/app/help/contacts',
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

export const disabledFilter = (link: IRouteElement): boolean => !link.disabled;