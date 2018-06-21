import React from 'react';
import QRCode from 'qrcode-react';
import cn from 'classnames';
import {Flip} from 'svg';

type TInfoCardProps = {
    title: string;
    data: string;
};

type TInfoCardState = {
    isQr: boolean;
};

export class InfoCard extends React.PureComponent<TInfoCardProps, TInfoCardState> {
    public readonly state: TInfoCardState = {
        isQr: false
    };

    protected flipToQr = () => {
        this.setState({isQr: true});
    };

    protected flipBack = () => {
        this.setState({isQr: false});
    };

    public render(): JSX.Element {
        return (
            <div className="info-card-container">
                <div className={cn("info-card", {'-flip': this.state.isQr})}>

                    <div className={cn("info-card-side", "-front", {'-is-open': !this.state.isQr})}>
                        <label className="info-card-side__title">{this.props.title}</label>
                        <textarea value={this.props.data} readOnly className="info-card-side__value"/>

                        <div onClick={this.flipToQr}>Show QR</div>
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
