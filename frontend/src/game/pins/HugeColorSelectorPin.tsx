import React from 'react';
import { HugePin } from './HugePin';
import { GameContext } from '../context/GameContext';

type HCSPState = {
    pinId: number,
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
        }
    }

    changePin(colours: number, callback: () => void) {
        this.setState((state) => ({
            pinId: (state.pinId + 1) % colours
        }), callback)
    }

    render() {
        return (
            <GameContext.Consumer>
            {({actualGuess, changeGuess, settings}) => (
                <HugePin pinId={this.state.pinId} onClick={() => {
                    this.changePin(settings.colours, () => {
                        actualGuess[this.props.pinIndex] = this.state.pinId
                        changeGuess(actualGuess)
                    })
                }
            }></HugePin>
            )}
          </GameContext.Consumer>

        )
    }
}

HugeColorSelectorPin.contextType = GameContext;

export {HugeColorSelectorPin};