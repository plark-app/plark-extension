import React from 'react';
import { Link } from 'react-router-dom';
import ReactSVG from 'react-svg';

export const AddWalletCard = (): JSX.Element => {
    return (
        <Link className="dashboard-add-coin" to="/app/options">
            <ReactSVG path="/images/coin-layout-bg.svg"
                      className="dashboard-add-coin-background"
                      wrapperClassName="dashboard-add-coin-background__wrapper" />
            <img src="/images/icons/add.svg" className="dashboard-add-coin__icon" />
            <div className="dashboard-add-coin__label">Add New Wallet</div>
        </Link>
    );
};
