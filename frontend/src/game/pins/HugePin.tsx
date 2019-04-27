import React from 'react';
import "./pins.scss"

type HugePinProps = { 
    pinId: number,
    changeable: boolean,
};

function getIconForPinId(id: number) {
    return id
}

const HugePin: React.FC<HugePinProps> = (props) => {
  return (
    <span className={`pin hugepin hugepin-${props.pinId}`}>
        {getIconForPinId(props.pinId)}
        {props.changeable ? "." : ""}
    </span>
  );
}

export {HugePin}