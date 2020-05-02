import React from 'react';
import "./playarea.scss";
import { LineType, SolutionType } from './types';
import { Line } from './Line';
import { Solution } from './Solution';

type PlayAreaProps = {
  submitInProgress: boolean,
  submitGuess: () => void,
  lines: LineType[],
  isOver: boolean,
  actualLine: number,
  solution: SolutionType,
};


const PlayArea: React.FC<PlayAreaProps> = (props: PlayAreaProps) => {
  const lines = props.lines.map((line: LineType, index: number) =>
    (<Line
      key={index}
      pins={line.guess}
      results={line.result}
      actual={(!props.isOver) && (index === props.actualLine)}
      submitInProgress={props.submitInProgress}
      submitGuess={props.submitGuess}
    />)
  )
  return (<div className="playarea">
    <Solution isOver={props.isOver} solution={props.solution} />
    {lines}
  </div>)

}

export { PlayArea }