import React from 'react';
import { HugePin } from './HugePin';
import { GameContext } from '../context/GameContext';
import "./colorselector.scss";

type HCSPState = {
    pinId: number,
};

type HCSPProps = {
    pinId: number,
    pinIndex: number,
    open: boolean,
    changeSelector: (i: number) => void,
}
class HugeColorSelectorPin extends React.Component<HCSPProps, HCSPState> {
    constructor(props: HCSPProps) {
        super(props);
        this.state = {
            pinId: props.pinId
        }
    }

    selectPin(selectablePin: number, actualGuess: number[], changeGuess: (g: number[]) => void) {
        this.setState({ pinId: selectablePin })
        actualGuess[this.props.pinIndex] = selectablePin
        changeGuess(actualGuess)
    }

    render() {
        return (
            <GameContext.Consumer>
                {({ actualGuess, changeGuess, settings }) => (
                    <details
                        open={this.props.open}
                        onClick={(e: React.MouseEvent) => {
                            this.props.changeSelector(this.props.pinIndex)
                            e.preventDefault()
                        }}>
                        <summary>
                            <HugePin pinId={this.state.pinId}></HugePin>
                        </summary>
                        <div className="pinselector">
                            {Array.from({ length: settings.colours }).map((_, selectablePin) => (
                                <HugePin
                                    key={`${this.props.pinId}-${selectablePin}`}
                                    pinId={selectablePin}
                                    marked={selectablePin === this.state.pinId}
                                    onClick={() => this.selectPin(selectablePin, actualGuess, changeGuess)}>
                                </HugePin>))
                            }
                        </div>
                    </details>)
                }
            </GameContext.Consumer>

        )
    }
}

HugeColorSelectorPin.contextType = GameContext;

export { HugeColorSelectorPin };