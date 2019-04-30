import React from 'react';
import "./pins.scss"

type SmallPinProps = { 
    pinId: number,
};

const SmallPin: React.FC<SmallPinProps> = (props) => {
  return (
    <div className={`pin smallpin smallpin-${props.pinId}`}></div>
  );
}

export {SmallPin}