import React from 'react';
import "./playarea.scss";
import { LineType } from './types';
import { Line } from './Line';
import { Solution } from './Solution';

type PlayAreaProps = {
  submitButton: JSX.Element,
  lines: LineType[],
  isOver: boolean,
  actualLine: number,
  solution: number[] | null,
};


const PlayArea: React.FC<PlayAreaProps> = (props: PlayAreaProps) => {
  const lines = props.lines.map((line: LineType, index: number) =>
    (<Line
      key={index}
      pins={line.guess}
      results={line.result}
      actual={(!props.isOver) && (index === props.actualLine)}
      actionButton={props.submitButton}>
    </Line>)
  )
  return (<div className="playarea">
    <Solution isOver={props.isOver} solution={props.solution} />
    {lines}
  </div>)

}

export { PlayArea }