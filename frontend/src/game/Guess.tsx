import React, { useState } from 'react';
import './guess.scss';
import { HugeColorSelectorPin } from './pins/HugeColorSelectorPin';
import { HugePin } from './pins/HugePin';

type GuessProps = {
    actual: boolean,
    pins: number[],
};

type GuessState = {
    openedSelectorNr: number
}

const Guess: React.FC<GuessProps> = (props: GuessProps) => {
    const [state, setState] = useState<GuessState>({
        openedSelectorNr: -1
    })
    return (<div className="guess">
        {props.actual
            ? (props.pins.map((pin, index) => (
                <HugeColorSelectorPin
                    pinId={pin}
                    key={`actual-${index}`}
                    pinIndex={index}
                    open={state.openedSelectorNr === index}
                    changeSelector={(index: number) => { setState((prevState) => ({ openedSelectorNr: (index !== prevState.openedSelectorNr) ? index : -1 })) }}
                >
                </HugeColorSelectorPin>)))
            : (props.pins.map((pin, index) => (<HugePin pinId={pin} key={`${index}-${pin}`} />)))
        }
    </div>)
};

export { Guess }
