import React from 'react';
import { HugePin } from './pins/HugePin';
import { SmallPin } from './pins/SmallPin';
import "./line.scss";
import { HugeColorSelectorPin } from './pins/HugeColorSelectorPin';

type LineState = {
  openedSelectorNr: number
}

type LineProps = {
  pins: number[],
  results: number[],
  actual: boolean,
  actionButton: JSX.Element,
};

class Line extends React.Component<LineProps, LineState> {
  constructor(props: LineProps) {
    super(props)
    this.state = {
      openedSelectorNr: -1
    }
  }

  render() {
    return (
      <div className={`line ${this.props.actual ? "actual" : ""}`}>
        <div className="playarea">
          {
            this.props.actual
              ?
              (this.props.pins.map((pin, index) => (
                <HugeColorSelectorPin
                  pinId={pin}
                  key={`actual-${index}`}
                  pinIndex={index}
                  open={this.state.openedSelectorNr === index}
                  changeSelector={(index: number) => { this.setState((prevState) => ({ openedSelectorNr: (index !== prevState.openedSelectorNr) ? index : -1 })) }}
                >
                </HugeColorSelectorPin>)))
              :
              (this.props.pins.map((pin, index) => (<HugePin pinId={pin} key={`${index}-${pin}`}></HugePin>)))
          }
        </div>
        <div className="results">
          {this.props.actual ?
            (<div className="submit">{this.props.actionButton}</div>)
            :
            (<div className="sent">{this.props.results.map((pin, index) => (<SmallPin pinId={pin} key={`${index}-${pin}`}></SmallPin>))}</div>)
          }
        </div>
      </div>
    );
  }
}

export { Line }