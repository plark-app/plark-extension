import React from 'react';
import './dot-loader.scss';

export const DotLoader = () => {
    return (
        <span className="dot-loader">
            <span className="dot-loader__dot" />
            <span className="dot-loader__dot" />
            <span className="dot-loader__dot" />
        </span>
    );
};
