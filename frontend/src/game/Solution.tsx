import React from 'react';
import "./line.scss";
import "./solution.scss";
import { Guess } from './Guess';
import { emptyGuess } from './context/GameContext';
import { SolutionType } from './types';

type SolutionProps = {
  isOver: boolean,
  solution: SolutionType,
};

const Solution: React.FC<SolutionProps> = (props: SolutionProps) => {
  return (<div className="line">
    <div className={`solution ${!props.isOver ? "hidden-solution" : ""}`}>
      <Guess pins={props.solution ? props.solution : emptyGuess.map(e => e)} actual={false} />
    </div>
    <div className="results"></div>
  </div>)
}

export { Solution }