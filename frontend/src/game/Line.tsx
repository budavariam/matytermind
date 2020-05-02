import React from 'react';
import { SmallPin } from './pins/SmallPin';
import "./line.scss";
import { Guess } from './Guess';
import { GuessType } from './types';
import { NEUTRALHUGEPIN, NEUTRALSMALLPIN } from './context/GameContext';

type LineProps = {
  pins: GuessType,
  results: GuessType,
  actual: boolean,
  submitInProgress: boolean,
  submitGuess: () => void,
};

const Line: React.FC<LineProps> = React.memo((props: LineProps) => {
  return (
    <div className={`line ${props.actual ? "actual" : ""}`} >
      <Guess actual={props.actual} pins={props.pins} />
      <div className="results">
        {props.actual
          ? (<div className="submit">
            {props.submitInProgress
              ? <div className="spinner"></div>
              : <div className="button" onClick={() => props.submitGuess()}>OK</div>}
          </div>)
          : (<div className="sent">{props.results.map((pin, index) => (
            <SmallPin pinId={pin} key={`${index}-${pin}`} />)
          )}</div>)
        }
      </div>
    </div >
  );
}, (pp, np) => {
  const emptyPins = np.results.every(e => e === NEUTRALSMALLPIN) && np.pins.every(e => e === NEUTRALHUGEPIN)
  const sameValues = (pp.results === np.results) && (pp.pins === np.pins)
  return np.actual
    ? sameValues && pp.submitInProgress === np.submitInProgress // there is no need to rerender current line if the loading state or values haven't changed.
    : sameValues || emptyPins // We don't need to rerender previous guesses, or later empty lines
});

export { Line }