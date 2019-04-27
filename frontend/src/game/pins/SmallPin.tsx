import React from 'react';
import "./pins.scss"

type SmallPinProps = { 
    pinId: number,
};

const SmallPin: React.FC<SmallPinProps> = (props) => {
  return (
    <span className={`pin smallpin smallpin-${props.pinId}`}></span>
  );
}

export {SmallPin}