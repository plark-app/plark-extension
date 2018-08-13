import React from 'react';
import {connect} from 'react-redux';
import {Wallet, HD} from '@berrywallet/core';
import QRCode from 'qrcode-react';
import ReactSVG from 'react-svg';
import Extberry from 'extberry';
import q from 'querystring';

import {Notice} from 'Popup/UI';
import {mapWalletCoinToProps} from 'Popup/Store/WalletCoinConnector';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';
import {copyToClipboard} from "Core/utils";

const browserTabs = Extberry.tabs;

const ButtonComponent = (props): JSX.Element => {
    return (
        <button className="receive-button" onClick={props.onClick}>
            <ReactSVG
                path={`/images/icons/${props.type}.svg`}
                className="receive-button__icon"
                wrapperClassName="receive-button__icon-wrapper"
            />
            <span className="receive-button__title">{props.title}</span>
        </button>
    );
};

// @TODO Need implement Props and State interface
class ReceiveScreen extends React.Component<any, any> {
    protected addressInput;

    public state = {
        copied: false
    };

    protected onCopy = (event): void => {
        copyToClipboard(this.addressInput).then(() => {
            this.setState({copied: true});
            setTimeout(() => {
                this.setState({copied: false});
            }, 2000);
        });
    };

    protected extractAddress = (): string => {
        const wdProvider = Wallet.Helper.createWDProvider(this.props.walletData);
        const addr = wdProvider.address.last(HD.BIP44.AddressType.RECEIVE);

        if (!addr) {
            throw new Error('Receive address not found!');
        }

        return addr.address;
    };

    protected onEmail = () => {
        const {coin} = this.props;
        const address = this.extractAddress();

        const requestString = q.stringify({
            subject: `My ${coin.name} address`,
            body: `Send me money at address ${address}`
        });

        browserTabs.create({url: `mailto:?${requestString}`});
    };


    protected onView = () => {
        const {coin} = this.props;
        const address = this.extractAddress();

        browserTabs.create({url: coin.generateAddrLink(address)});
    };

    public render(): JSX.Element {
        const {coin} = this.props;
        const address = this.extractAddress();

        return (
            <div className="wallet-wrapper receive">
                <TrackScreenView trackLabel={`wallet-${coin.getKey()}-receive`}/>

                <div>
                    <Notice className='receive-copied' show={this.state.copied}>Address copied!</Notice>
                    <div className="receive-qr">
                        <QRCode value={address} size={84} bgColor="#ffffff" fgColor="#333333"/>
                    </div>
                </div>
                <h2 className="receive-label">{coin.key} Wallet Address</h2>
                <input readOnly={true} value={address}
                       className="receive-address"
                       ref={(elem) => this.addressInput = elem}
                />

                <div className="receive-control">
                    <ButtonComponent type="copy" title="Copy address" onClick={this.onCopy}/>
                    <ButtonComponent type="mail" title="Email address" onClick={this.onEmail}/>
                    <ButtonComponent type="link" title="View on Blockchain" onClick={this.onView}/>
                </div>
            </div>
        );
    }
}


export const ReceiveScreenComponent = connect(mapWalletCoinToProps)(ReceiveScreen);
