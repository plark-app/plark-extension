import React from 'react';
import ReactSVG from 'react-svg';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import {RemoteLink} from 'Popup/UI';
import './contact-screen.scss';

const socialLinks = [
    {
        key: 'facebook',
        title: 'Facebook',
        href: 'https://www.facebook.com/berrywallet.io/'
    }, {
        key: 'twitter',
        title: 'Twitter',
        href: 'https://twitter.com'
    }, {
        key: 'telegram',
        title: 'Telegram',
        href: 'https://t.me/berrywallet'
    }, {
        key: 'github',
        title: 'Github',
        href: 'https://github.com/BerryWallet'
    }, {
        key: 'bitcointalk',
        title: 'Bitcointalk',
        href: 'https://bitcointalk.com'
    }
];

const emails = [
    {
        title: 'General Questions',
        email: 'info@berrywallet.io'
    }, {
        title: 'Collaboration & Joint Ventures',
        email: 'collaboration@berrywallet.io'
    }, {
        title: 'Marketing',
        email: 'marketing@berrywallet.io'
    }, {
        title: 'Investor Relations',
        email: 'ir@berrywallet.io'
    }, {
        title: 'Press',
        email: 'press@berrywallet.io'
    }
];

export class ContactsScreen extends React.PureComponent<any, any> {

    protected drawSocialLinks(): JSX.Element[] {
        return socialLinks.map((item) => {
            const linkProps = {
                key: item.key,
                className: `contacts-social__item -${item.key}`,
                to: item.href
            };

            return (
                <RemoteLink {...linkProps}>
                    <ReactSVG
                        path={`/images/icons/${item.key}.svg`}
                        className="contacts-social__item-icon"
                        wrapperClassName="contacts-social__item-icon-wrapper"
                    />
                    <span className="contacts-social__item-title">{item.title}</span>
                </RemoteLink>
            )
        })
    }

    protected drawEmails(): JSX.Element[] {
        return emails.map((item, index) => {
            const linkProps = {
                className: "contacts-email__email text-link",
                to: `mailto:${item.email}`
            };

            return (
                <div key={index} className="contacts-email">
                    <div className="contacts-email__title">{item.title}:</div>
                    <RemoteLink {...linkProps}>{item.email}</RemoteLink>
                </div>
            )
        })
    }

    public render(): JSX.Element {
        return (
            <div className="contacts-wrapper">
                <TrackScreenView trackLabel="help-contacts"/>

                <div className="card contacts-card">
                    <h1 className="title">Contacts</h1>
                    <div className="contacts-email-wrapper">{this.drawEmails()}</div>
                </div>

                <div className="contacts-social">
                    {this.drawSocialLinks()}
                </div>
            </div>
        );
    }
}
