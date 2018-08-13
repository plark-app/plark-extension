import React from 'react';
import { map } from 'lodash';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { NavLink, withRouter, matchPath } from 'react-router-dom';

@withRouter
export class MenuLayout extends React.Component {

    getSize() {
        return this.props.isSmall ? 45 : 50;
    }

    renderSvgBackground() {
        const {
            location,
            maskKey,
            links = [],
            svgStyle = {},
            isSmall = true
        } = this.props;

        const activeIndex = links.findIndex((link) => {
            return matchPath(location.pathname, {
                path: link.path,
                exact: link.isExact || false,
                strict: link.isStrict || false
            });
        });

        const svgMaskProps = {
            className: 'menu-background__hole',
            height: `${this.getSize()}px`,
            width: '6px',
            fill: 'black',
            x: '-3px',
            y: (this.getSize() * activeIndex + 10) + 'px',
            rx: '3px',
            ry: '3px'
        };

        const maskId = `home-menu-shit__${maskKey}`;

        return (
            <svg className="menu-background" style={svgStyle}>
                <rect height="100%" width="100%" mask={`url(#${maskId})`} fill="white" />
                <mask id={maskId}>
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <rect {...svgMaskProps} />
                </mask>
            </svg>
        );
    }

    render() {
        return (
            <nav className={cn(this.props.containerClassName, 'menu-container')}>
                {this.renderSvgBackground()}

                {map(this.props.links, (link, index) => {
                    const props = {
                        key: index,
                        to: link.path,
                        exact: link.isExact || false,
                        className: cn(this.props.itemClassName, 'menu-item'),
                        activeClassName: '-active',
                        style: {
                            lineHeight: this.getSize() + 'px'
                        }
                    };

                    return <NavLink {...props}>{link.name}</NavLink>;
                })}
            </nav>
        )
    }
}

MenuLayout.propTypes = {
    containerClassName: PropTypes.string.isRequired,
    itemClassName: PropTypes.string.isRequired,
    links: PropTypes.array.isRequired,
    maskKey: PropTypes.string.isRequired,

    svgStyle: PropTypes.object,
    isSmall: PropTypes.bool
};