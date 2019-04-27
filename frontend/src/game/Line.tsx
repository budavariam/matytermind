import React from 'react';
import { HugePin } from './pins/HugePin';
import { SmallPin } from './pins/SmallPin';
import "./line.scss";
import { HugeColorSelectorPin } from './pins/HugeColorSelectorPin';

type LineProps = {
  pins: number[],
  results: number[],
  actual: boolean,
};

const Line: React.FC<LineProps> = (props) => {
  return (
    <div className={`line ${props.actual ? "actual" : ""}`}>
      <div className="playarea">
        {
          props.actual
            ?
            (props.pins.map((pin, index) => (<HugeColorSelectorPin pinId={pin} key={`actual-${index}`}></HugeColorSelectorPin>)))
            :
            (props.pins.map((pin, index) => (<HugePin pinId={pin} key={`${index}-${pin}`}></HugePin>)))
        }
      </div>
      <div className="results">
        {props.results.map((pin, index) => (<SmallPin pinId={pin} key={`${index}-${pin}`}></SmallPin>))}
      </div>
    </div>
  );
}

export { Line }