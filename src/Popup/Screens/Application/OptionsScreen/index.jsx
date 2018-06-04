import React from 'react';
import classNames from 'classnames';
import {Route, Switch, Redirect} from 'react-router-dom';
import {filter, find} from 'lodash';

import {MenuLayout} from 'Popup/UI/Layouts';

import {WalletsScreen} from "./WalletsScreen";
import {FiatsScreen} from "./FiatsScreen";
import {AddressesScreen} from "./AddressesScreen";
import {MiningFeeScreen} from "./MiningFeeScreen";
import {SecurityScreen} from "./SecurityScreen";
import {ResetScreen} from "./ResetScreen";

const links = [{
    path: '/app/options/wallet',
    name: 'Wallets',
    component: WalletsScreen
}, {
    path: '/app/options/fiat',
    name: 'Currency',
    component: FiatsScreen
}, {
    path: '/app/options/addresses',
    name: 'Addresses',
    disabled: true,
    component: AddressesScreen
}, {
    path: '/app/options/security',
    name: 'Security',
    component: SecurityScreen
}, {
    path: '/app/options/mining-fee',
    name: 'Mining Fee',
    component: MiningFeeScreen
}, {
    path: '/app/options/reset',
    name: 'Reset',
    component: ResetScreen
}];

export class OptionsScreen extends React.Component {
    state = {
        loaded: false
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState(() => ({loaded: true}));
        }, 0);
    }

    redirectFromRoot = () => {
        const firstEnabled = find(links, (item) => !item.disabled);

        return <Redirect to={firstEnabled.path}/>;
    };

    render() {
        const enabledLinks = filter(links, (item) => !item.disabled);

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
                        <Route path="/app/options" exact={true} component={this.redirectFromRoot}/>
                        {enabledLinks.map((elem, index) => {
                            return <Route key={index}
                                          path={elem.path}
                                          component={elem.component || null}
                            />
                        })}
                    </Switch>
                </div>
            </div>
        );
    }
}
