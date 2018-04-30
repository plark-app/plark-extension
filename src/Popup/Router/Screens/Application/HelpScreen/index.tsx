import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {filter, find} from 'lodash';
import classNames from 'classnames';
import {MenuLayout} from 'Popup/UI/Layouts';

import {routerElements, disabledFilter, IRouteElement} from './Routes';

export class HelpScreen extends React.Component<any, any> {
    state = {
        loaded: false
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState(() => ({loaded: true}));
        }, 0);
    }

    redirectFromRoot = () => {
        const firstEnabled = find(routerElements, disabledFilter);

        return <Redirect to={firstEnabled.path}/>
    };

    render() {
        const enabledElements = filter<IRouteElement>(routerElements, disabledFilter);

        return (
            <div className="page-wrapper">
                <MenuLayout
                    containerClassName={classNames('page-nav', {'-loaded': this.state.loaded})}
                    itemClassName="page-nav__item"
                    links={enabledElements}
                    maskKey="help"
                    svgStyle={{borderRadius: "3px"}}
                    isSmall={true}
                />
                <div className="page-content">
                    <Switch>
                        <Route path="/app/help" exact={true} component={this.redirectFromRoot}/>
                        {enabledElements.map((elem: IRouteElement, index: number) => {
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
