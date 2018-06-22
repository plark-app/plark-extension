import React from 'react';
import Extberry from 'extberry';
import QRCode from 'qrcode-react';
import cn from 'classnames';
import {Notice, Tooltip} from 'Popup/UI';
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
            this.setState({copied: true});

            setTimeout(() => this.setState({copied: false}), 1000);
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

                        <Notice className='info-card-side__copied' show={this.state.copied}>
                            {this.props.title} copied!
                        </Notice>

                        <div className="info-card-side__buttons">

                            <Tooltip title="Copy">
                                <Copy className="info-card-side-button" onClick={this.onClickCopy}/>
                            </Tooltip>

                            <Tooltip title="Show QR code">
                                <QR className="info-card-side-button" onClick={this.flipToQr}/>
                            </Tooltip>

                            {this.props.link && <Tooltip title="Open link">
                                <Link className="info-card-side-button" onClick={this.onClickLink}/>
                            </Tooltip>}
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
