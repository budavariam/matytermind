import React from 'react';
import "./pins.scss"

type HugePinProps = { 
    pinId: number,
    changeable: boolean,
};

function getIconForPinId(id: number) {
    return "";
}

const HugePin: React.FC<HugePinProps> = (props) => {
  return (
    <span className={`pin hugepin hugepin-${props.pinId} ${props.changeable ? "actual" : ""}`}>
        {getIconForPinId(props.pinId)}
    </span>
  );
}

export {HugePin}