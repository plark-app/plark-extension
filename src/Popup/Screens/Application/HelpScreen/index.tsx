import React from 'react';
import classNames from 'classnames';
import { Route, Switch, Redirect } from 'react-router-dom';
import { filter, find } from 'lodash';
import { MenuLayout } from 'Popup/UI/Layouts';
import { routerElements, disabledFilter, RouteDescriptor } from './routes';

interface HelpScreenState {
    loaded: boolean;
}

export class HelpScreen extends React.Component<object, HelpScreenState> {
    public state: HelpScreenState = {
        loaded: false,
    };

    public componentDidMount(): void {
        setTimeout(() => {
            this.setState(() => ({ loaded: true }));
        }, 0);
    }

    public redirectFromRoot = () => {
        const firstEnabled = find(routerElements, disabledFilter);

        return <Redirect to={firstEnabled.path} />;
    };

    public render(): JSX.Element {
        const enabledElements = filter<RouteDescriptor>(routerElements, disabledFilter);

        return (
            <div className="page-wrapper">
                <MenuLayout
                    containerClassName={classNames('page-nav', { '-loaded': this.state.loaded })}
                    itemClassName="page-nav__item"
                    links={enabledElements}
                    maskKey="help"
                    svgStyle={{ borderRadius: '3px' }}
                    isSmall={true}
                />
                <div className="page-content">
                    <Switch>
                        <Route path="/app/help" exact={true} component={this.redirectFromRoot} />
                        {enabledElements.map((elem: RouteDescriptor, index: number) => (
                            <Route key={index} path={elem.path} component={elem.component} />
                        ))}
                    </Switch>
                </div>
            </div>
        );
    }
}
