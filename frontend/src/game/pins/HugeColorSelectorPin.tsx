import React from 'react';
import { HugePin } from './HugePin';
import { GameContextType } from '../types';
import { GameContext, emptyGuess } from '../context/GameContext';
import { defaultSettings } from './../context/GameContext';

type HCSPState = {
    pinId: number,
    context: GameContextType,
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
            context: {
                id: "",
                settings: defaultSettings,
                actualLine: 0,
                actualGuess: emptyGuess,
                changeGuess: (_) => {}
            }
        }
    }

    changePin(callback: () => void) {
        this.setState((state) => ({
            pinId: (state.pinId + 1) % state.context.settings.colours
        }), callback)
    }

    render() {
        return (
            <GameContext.Consumer>
            {({actualGuess, changeGuess}) => (
                <HugePin pinId={this.state.pinId} onClick={() => {
                    this.changePin(() => {
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