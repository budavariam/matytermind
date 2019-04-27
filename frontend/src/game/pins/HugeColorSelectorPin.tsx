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
            }
        }
    }

    changePin() {
        this.setState((state) => ({
            pinId: (state.pinId + 1) % state.context.settings.colours
        }))
    }

    render() {
        return (
            <GameContext.Provider value={this.state.context}>
                <HugePin pinId={this.state.pinId} onClick={() => this.changePin()}></HugePin>
            </GameContext.Provider>
        )
    }
}

HugeColorSelectorPin.contextType = GameContext;

export {HugeColorSelectorPin};