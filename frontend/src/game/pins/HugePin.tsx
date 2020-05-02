import React from 'react';
import "./pins.scss"

type HugePinProps = {
  pinId: number,
  marked?: boolean,
  onClick?: () => void,
};

const HugePin: React.FC<HugePinProps> = React.memo((props) => {
  return (
    <div className={`pin hugepin hugepin-${props.pinId} ${props.marked ? "marked" : ""}`} onClick={props.onClick}></div>
  );
}, (pp, np) => pp.pinId === np.pinId)

export { HugePin }