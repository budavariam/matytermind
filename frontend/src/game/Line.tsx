import React from 'react';
import { HugePin } from './pins/HugePin';
import { SmallPin } from './pins/SmallPin';
import "./line.scss";

type LineProps = { 
    pins: number[],
    results: number[],
    actual: boolean,
};

const Line: React.FC<LineProps> = (props) => {
  return (
    <div className="line">
      <div className="playarea">
        {props.pins.map((pin, index) => (<HugePin changeable={props.actual} pinId={pin} key={`${index}-${pin}`}></HugePin>))}
      </div>
      <div className="results">
        {props.results.map((pin, index) => (<SmallPin pinId={pin} key={`${index}-${pin}`}></SmallPin>))}
      </div>
    </div>
  );
}

export {Line}