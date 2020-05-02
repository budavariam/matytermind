import React from 'react';
import { SmallPin } from './pins/SmallPin';
import "./line.scss";
import { Guess } from './Guess';
import { GuessType } from './types';

type LineProps = {
  pins: GuessType,
  results: GuessType,
  actual: boolean,
  actionButton: JSX.Element,
};

const Line: React.FC<LineProps> = (props: LineProps) => {
  return (
    <div className={`line ${props.actual ? "actual" : ""}`}>
      <Guess actual={props.actual} pins={props.pins}/>
      <div className="results">
        {props.actual
          ? (<div className="submit">{props.actionButton}</div>)
          : (<div className="sent">{props.results.map((pin, index) => (
            <SmallPin pinId={pin} key={`${index}-${pin}`} />)
          )}</div>)
        }
      </div>
    </div>
  );
}

export { Line }