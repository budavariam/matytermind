import React, { useState, useEffect, useContext } from 'react';
import { Line } from './Line';
import { GameResponse, GameSettings, LineType } from './types';
import { GameContext, defaultSettings, emptyGuess, GOODGUESSPINID, GOODCOLOURPINID, NEUTRALSMALLPIN } from './context/GameContext';
import "./game.scss";
import { Header } from './Header';
import { Footer } from './Footer';

type GameState = {
    error: { message: string } | null,
    isLoaded: boolean,
    lines: LineType[],
    isOver: boolean,
    submitInProgress: boolean,
};

const Game: React.FC<{}> = () => {
    const context = useContext(GameContext)

    const generateLines = (settings: GameSettings): LineType[] => {
        const emptyLine = {
            guess: emptyGuess.map(e => e),
            result: Array.from({ length: settings.pins }, () => NEUTRALSMALLPIN),
        }
        return Array.from({ length: settings.lines }, () => emptyLine)
    }

    const [state, setState] = useState<GameState>({
        error: null,
        isLoaded: false,
        submitInProgress: false,
        lines: generateLines(defaultSettings),
        isOver: false,
    })


    useEffect(() => {
        fetch("/api/start")
            .then(res => res.json())
            .then(
                (result) => {
                    context.setId(result.id)
                    setState({
                        ...state,
                        isOver: result.isOver,
                        isLoaded: true,
                    });
                },
                (error) => {
                    console.error(error)
                    setState({
                        ...state,
                        isLoaded: true,
                        error: { message: "There was an error during server request, sorry for the inconvenience :(" },
                    });
                }
            )
        // The empty bracket is intentional in useEffect dependency list. It is there to ensure that this hook runs only once
        // eslint-disable-next-line
    }, [])

    const setLineFromResponse = (lines: LineType[], data: GameResponse): LineType[] => {
        const evaluation = []
        for (let i = 0; i < data.goodGuess; i++) {
            evaluation.push(GOODGUESSPINID)
        }
        for (let i = 0; i < data.goodColour; i++) {
            evaluation.push(GOODCOLOURPINID)
        }
        while (evaluation.length < context.settings.pins) {
            evaluation.push(NEUTRALSMALLPIN)
        }
        lines[context.actualLine] = {
            guess: context.actualGuess.map((e: number) => e),
            result: evaluation,
        }
        context.nextLine()
        return lines
    }

    const submitGuess = () => {
        if (context.actualGuess.some((el: number) => el < 0 || el > context.settings.colours)) {
            setState({
                ...state,
                error: { message: "Please fill each slot!" },
            });
        } else {
            setState({
                ...state,
                submitInProgress: true,
            })
            fetch('/api/guess', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: context.id, guess: context.actualGuess })
            })
                .then(res => res.json())
                .then(
                    (result: GameResponse) => {
                        if (result.message) {
                            setState({
                                ...state,
                                error: { message: result.message }
                            });
                        } else {
                            setState({
                                ...state,
                                isOver: result.isOver,
                                lines: setLineFromResponse(state.lines, result),
                                error: null
                            });
                        }
                    },
                    (error) => {
                        console.error(error)
                        setState({
                            ...state,
                            isLoaded: true,
                            error: { message: "There was an error during server request, sorry for the inconvenience :(" },
                        });
                    }
                )
                .then(() => setState({ ...state, submitInProgress: false }))
        }
    }

    const renderLines = (submitButton: JSX.Element) => {
        return state.lines.map((line: LineType, index: number) =>
            (<Line
                key={index}
                pins={line.guess}
                results={line.result}
                actual={(!state.isOver) && (index === context.actualLine)}
                actionButton={submitButton}>
            </Line>)
        )
    }

    const { error, isLoaded, submitInProgress } = state;
    const submitButton = (<div className="button" onClick={() => submitGuess()}>OK</div>)
    const waitingForResponse = (<div className="spinner"></div>)
    return (
        <div className="game">
            <Header
                lessLine={context.actualLine < context.settings.lines}
                isOver={state.isOver}
                error={error}
                isLoaded={isLoaded}
            >
            </Header>
            {(isLoaded) && (
                <div className="linecontainer">
                    {renderLines(submitInProgress ? waitingForResponse : submitButton)}
                </div>
            )}
            <Footer></Footer>
        </div>
    )
}

export { Game };