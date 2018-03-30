import React from 'react';
import ReactSVG from 'react-svg';
import {filter, map} from 'lodash';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {showAlert} from "Popup/Router/Alert";

import proxyStore from 'Popup/Store';
import {mapWelcomeDispatchers} from 'Popup/Store/KeyringConnector';
import {coinList, CoinSymbol} from 'Core/Coins';
import WelcomeLayout from './Parts/WelcomeLayout';
import WelcomeLink from 'Popup/Router/Screens/StartUpScreen/Parts/WelcomeLink';
import {Button} from "Popup/Router/UIComponents";


@connect(null, mapWelcomeDispatchers)
export default class ChooseCoinsScreen extends React.Component {

    state = {
        selected: [CoinSymbol.Bitcoin]
    };

    onSaveCoins = () => {
        if (this.state.selected.length < 1) {
            return false;
        }

        proxyStore.dispatch({
            type: 'WELCOME::SET_COINS',
            coins: this.state.selected
        });

        this.props.pushWelcomeLocation("/startup/prepare");
    };

    onBack = () => {
        proxyStore.dispatch({type: "WELCOME::CLEAR_COINS"});
    };

    onSelectCoin = (key) => {
        return (event) => {
            let newSelected = [...this.state.selected];

            if (newSelected.includes(key)) {
                newSelected = filter(newSelected, (existCoin) => existCoin !== key);
            } else {
                newSelected.push(key);
            }

            if (newSelected.length < 1) {
                showAlert({
                    message: "Uh-oh! Please select at least one wallet.",
                    noBody: true
                });
            }

            this.setState(() => {
                return {selected: newSelected};
            });
        }
    };

    renderCoinIcon = (coin) => {
        const isActive = this.state.selected.includes(coin.getKey());

        const itemProps = {
            key: coin.getKey(),
            onClick: this.onSelectCoin(coin.getKey()),
            className: classNames("coins-item", {"-active": isActive})
        };

        const coinSvgIconProps = {
            path: `/images/coins/${coin.getKey()}.svg`,
            className: classNames("coin-icon", `-${coin.getKey()}`),
            wrapperClassName: "coin-icon-wrapper",
            style: {width: 30, height: 30}
        };

        return (
            <div {...itemProps}>
                <ReactSVG {...coinSvgIconProps}/>
                <div className="coins-item__label">
                    <b className={`coins-item__label-key text-${coin.getKey()}`}>{coin.getKey()}</b>
                    <span className="coins-item__label-name">{coin.getName()}</span>
                </div>
                <ReactSVG
                    path="/images/icons/tick.svg"
                    className="coins-item-checkbox__tick"
                    wrapperClassName="coins-item-checkbox"
                />
            </div>
        );
    };

    render() {
        const coinsForShow = filter(coinList, coin => !coin.isTest());

        const layoutProps = {
            className: "startup-coins",
            trackLabel: "startup-coins",
            topicTitle: "Choose Your Wallets",
            topicDescription: "Please select the wallets you wish to display.",
            onPressEnter: this.onSaveCoins
        };

        return (
            <WelcomeLayout {...layoutProps}>

                <div className="startup-wrapper coins-list">
                    {map(coinsForShow, (coin) => this.renderCoinIcon(coin))}
                </div>

                <Button
                    className="btn startup-welcome-button"
                    disabled={this.state.selected.length < 1}
                    onClick={this.onSaveCoins}
                >Proceed</Button>

                <WelcomeLink
                    to="/startup/passcode"
                    className="startup-back-link"
                    onClick={this.onBack}
                >← Back to previous screen</WelcomeLink>
            </WelcomeLayout>
        );
    }
}
