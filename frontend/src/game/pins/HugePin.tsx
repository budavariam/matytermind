import React from 'react';
import "./pins.scss"

type HugePinProps = { 
    pinId: number,
    marked?: boolean,
    onClick?: () => void,
};

const HugePin: React.FC<HugePinProps> = (props) => {
  return (
    <div className={`pin hugepin hugepin-${props.pinId} ${props.marked ? "marked" : ""}`} onClick={props.onClick}></div>
  );
}

export {HugePin}