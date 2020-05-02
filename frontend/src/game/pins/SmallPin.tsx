import React from 'react';
import "./pins.scss"

type SmallPinProps = {
  pinId: number,
};

const SmallPin: React.FC<SmallPinProps> = React.memo((props) => {
  return (
    <div className={`pin smallpin smallpin-${props.pinId}`}></div>
  );
}, (pp, np) => pp.pinId === np.pinId)

export { SmallPin }