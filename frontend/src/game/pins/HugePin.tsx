import React from 'react';
import "./pins.scss"

type HugePinProps = { 
    pinId: number,
    onClick?: () => void,
};

function getIconForPinId(id: number) {
    return "";
}

const HugePin: React.FC<HugePinProps> = (props) => {
  return (
    <span className={`pin hugepin hugepin-${props.pinId}`} onClick={props.onClick}>
        {getIconForPinId(props.pinId)}
    </span>
  );
}

export {HugePin}