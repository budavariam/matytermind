import React from 'react';
import "./pins.scss"

type SmallPinProps = { 
    pinId: number,
};

function getIconForPinId(id: number) {
    return id
}

const SmallPin: React.FC<SmallPinProps> = (props) => {
  return (
    <span className={`pin smallpin smallpin-${props.pinId}`}>
        {getIconForPinId(props.pinId)}
    </span>
  );
}

export {SmallPin}