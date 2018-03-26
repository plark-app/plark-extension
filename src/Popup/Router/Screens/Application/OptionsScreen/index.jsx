import React from 'react';
import classNames from 'classnames';
import {Route, Switch} from 'react-router-dom';
import {filter} from 'lodash';

import MenuLayout from "Popup/Router/Layouts/MenuLayout";

import WalletsScreen from "./WalletsScreen";
import FiatsScreen from "./FiatsScreen";
import AddressesScreen from "./AddressesScreen";
import MiningFeeScreen from "./MiningFeeScreen";
import ResetScreen from "./ResetScreen";

const links = [
    {
        path: '/app/options',
        name: 'Wallets',
        isExact: true,
        isStrict: true
    }, {
        path: '/app/options/fiat',
        name: 'Currency'
    }, {
        path: '/app/options/addresses',
        name: 'Addresses',
        disabled: true
    }, {
        path: '/app/options/security',
        name: 'Security',
        disabled: true
    }, {
        path: '/app/options/mining-fee',
        name: 'Mining Fee'
    }, {
        path: '/app/options/reset',
        name: 'Reset'
    }
];

export default class OptionsScreen extends React.Component {
    state = {
        loaded: false
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState(() => {
                return {
                    loaded: true
                };
            });
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
                    itemClassName={'page-nav__item'}
                    links={enabledLinks}
                    maskKey="options"
                    svgStyle={{borderRadius: "3px"}}
                    isSmall={true}
                />
                <div className="page-content">
                    <Switch>
                        <Route exact={true} path={`/app/options`} component={WalletsScreen}/>
                        <Route path={`/app/options/fiat`} component={FiatsScreen}/>
                        <Route path={`/app/options/addresses`} component={AddressesScreen}/>

                        <Route path={`/app/options/security`} component={null}/>
                        <Route path={`/app/options/mining-fee`} component={MiningFeeScreen}/>
                        <Route path={`/app/options/reset`} component={ResetScreen}/>
                    </Switch>
                </div>
            </div>
        );
    }
}
