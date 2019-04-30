import React from 'react';
import { HugePin } from './HugePin';
import { GameContext } from '../context/GameContext';

type HCSPState = {
    pinId: number,
    opened: boolean,
};

type HCSPProps = {
    pinId: number,
    pinIndex: number,
}
class HugeColorSelectorPin extends React.Component<HCSPProps, HCSPState> {
    constructor(props: HCSPProps) {
        super(props);
        this.state = {
            pinId: props.pinId,
            opened: false
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
                        open={this.state.opened}
                        onClick={(e: any) => {
                            this.setState((prevState) => ({ opened: !prevState.opened }));
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