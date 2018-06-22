import React from 'react';
import Extberry from 'extberry';
import QRCode from 'qrcode-react';
import cn from 'classnames';
import {Flip, Copy, QR, Link} from 'svg';
import {copyToClipboard} from 'Core/Utils';


type TInfoCardProps = {
    title: string;
    data: string;
    link?: string;
};

type TInfoCardState = {
    isQr: boolean;
    copied: boolean;
};

export class InfoCard extends React.PureComponent<TInfoCardProps, TInfoCardState> {

    protected textarea;

    public readonly state: TInfoCardState = {
        isQr: false,
        copied: false
    };

    protected flipToQr = () => {
        this.setState({isQr: true});
    };

    protected flipBack = () => {
        this.setState({isQr: false});
    };

    protected onClickLink = () => {
        Extberry.openTab({url: this.props.link});
    };

    protected onClickCopy = () => {
        copyToClipboard(this.textarea).then(() => {
            console.log('Copied');
        });
    };

    public render(): JSX.Element {
        return (
            <div className="info-card-container">
                <div className={cn("info-card", {'-flip': this.state.isQr})}>

                    <div className={cn("info-card-side", "-front", {'-is-open': !this.state.isQr})}>
                        <label className="info-card-side__title">{this.props.title}</label>
                        <textarea value={this.props.data}
                                  readOnly
                                  className="info-card-side__value"
                                  ref={(elem) => this.textarea = elem}
                        />

                        <div className="info-card-side__buttons">
                            <Copy className="info-card-side-button" onClick={this.onClickCopy}/>
                            <QR className="info-card-side-button" onClick={this.flipToQr}/>
                            {this.props.link &&
                            <Link className="info-card-side-button" onClick={this.onClickLink}/>
                            }
                        </div>
                    </div>


                    <div className={cn("info-card-side", "-back", {'-is-open': this.state.isQr})}>
                        <div className="info-card-side__qr">
                            <QRCode value={this.props.data} size={100} bgColor="#ffffff" fgColor="#333333"/>
                        </div>

                        <Flip onClick={this.flipBack} className="info-card-side__back-button"/>
                    </div>

                </div>
            </div>
        );
    }
}
