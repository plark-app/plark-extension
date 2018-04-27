import React from 'react';
import ReactSVG from 'react-svg';

export class WaitInitializingScreen extends React.Component<any, any> {
    render(): JSX.Element {
        const {coin} = this.props;

        return (
            <div className="wallet-initializing">
                <ReactSVG
                    path={`/images/icons/notice.svg`}
                    className="wallet-initializing__notice"
                    wrapperClassName="wallet-initializing__notice-wrapper"
                />
                <div className="wallet-initializing__title">Initializing {coin.name} Wallet…</div>
                <p className="wallet-initializing__desc">
                    Please wait, your {coin.name} Wallet is being imported to BerryWallet.
                </p>
            </div>
        )
    }
}
