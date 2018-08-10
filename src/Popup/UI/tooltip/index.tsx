import React from "react";
import './tooltip.scss';

type TTooltipProps = React.HTMLProps<{}> & {
    title: string;
};

export const Tooltip = (props: TTooltipProps) => {
    return <span className="tooltip-wrapper">
            {props.children}
        <label className="tooltip">{props.title}</label>
    </span>
};
