import React from 'react';
import {connect} from 'react-redux';
import {Wallet, HD} from '@berrywallet/core';
import QRCode from 'qrcode-react';
import ReactSVG from 'react-svg';
import q from 'querystring';

import {Extension} from 'Core';
import {Notice} from "Popup/Service/UIComponents";
import {mapWalletCoinToProps} from 'Popup/Store/WalletCoinConnector';
import TrackScreenView from 'Popup/Service/ScreenViewAnalitics';

const browserTabs = Extension.extensionInstance.getTabs();

const ButtonComponent = (props) => {
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


@connect(mapWalletCoinToProps)
export default class ReceiveScreen extends React.Component {
    addressInput;
    state = {
        copied: false
    };


    onCopy = (event) => {
        this.addressInput.select();

        try {
            let successful = document.execCommand('copy');
            if (!successful) {
                return;
            }

            this.setState(() => {
                setTimeout(() => {
                    this.setState(() => {
                        return {copied: false};
                    });
                }, 2000);

                return {
                    copied: true
                };
            });
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    };


    extractAddress = () => {
        const wdProvider = new Wallet.Helper.createWDProvider(this.props.walletData);
        const addr = wdProvider.address.last(HD.BIP44.AddressType.RECEIVE);

        return addr ? addr.address : '';
    };

    onPrint = (event) => {

    };

    onEmail = () => {
        const {coin} = this.props;
        const address = this.extractAddress();

        const requestString = q.stringify({
            subject: `My ${coin.name} address`,
            body: `Send me money at address ${address}`
        });

        browserTabs.create({url: `mailto:?${requestString}`});
    };


    onView = () => {
        const {coin} = this.props;
        const address = this.extractAddress();

        browserTabs.create({url: coin.generateAddrLink(address)});
    };


    render() {
        const {coin} = this.props;
        const address = this.extractAddress();

        return (
            <div className="wallet-wrapper receive">
                <TrackScreenView trackLabel="wallet-receive"/>

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
                    {/*<ButtonComponent type="print" title="Print address" onClick={this.onPrint}/>*/}
                    <ButtonComponent type="mail" title="Email address" onClick={this.onEmail}/>
                    <ButtonComponent type="link" title="View on Blockchain" onClick={this.onView}/>
                </div>
            </div>
        );
    }
}
