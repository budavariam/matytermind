import React, { useState } from 'react';
import { HugePin } from './HugePin';
import { GameContext } from '../context/GameContext';
import "./colorselector.scss";
import { GuessType } from '../types';

type HCSPState = {
    pinId: number,
};

type HCSPProps = {
    pinId: number,
    pinIndex: number,
    open: boolean,
    changeSelector: (i: number) => void,
}
const HugeColorSelectorPin: React.FC<HCSPProps> = (props: HCSPProps) => {
    const [state, setState] = useState<HCSPState>({
        pinId: props.pinId
    })

    const selectPin = (selectablePin: number, actualGuess: GuessType, changeGuess: (g: GuessType) => void) => {
        setState({ pinId: selectablePin })
        actualGuess[props.pinIndex] = selectablePin
        changeGuess(actualGuess)
    }

    return (
        <GameContext.Consumer>
            {({ actualGuess, changeGuess, settings }) => (
                <details
                    open={props.open}
                    onClick={(e: React.MouseEvent) => {
                        props.changeSelector(props.pinIndex)
                        e.preventDefault()
                    }}>
                    <summary>
                        <HugePin pinId={state.pinId}></HugePin>
                    </summary>
                    <div className="pinselector">
                        {Array.from({ length: settings.colours }).map((_, selectablePin) => (
                            <HugePin
                                key={`${props.pinId}-${selectablePin}`}
                                pinId={selectablePin}
                                marked={selectablePin === state.pinId}
                                onClick={() => selectPin(selectablePin, actualGuess, changeGuess)}>
                            </HugePin>))
                        }
                    </div>
                </details>)
            }
        </GameContext.Consumer>
    )
}

export { HugeColorSelectorPin };