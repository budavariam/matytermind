import React, { useEffect, useContext, useReducer } from 'react';
import { GameResponse, GameSettings, LineType, ErrorType, SolutionType } from './types';
import { GameContext, defaultSettings, emptyGuess, GOODGUESSPINID, GOODCOLOURPINID, NEUTRALSMALLPIN } from './context/GameContext';
import "./game.scss";
import { Header } from './Header';
import { Footer } from './Footer';
import { PlayArea } from './PlayArea';

type GameState = {
    error: ErrorType,
    isLoaded: boolean,
    lines: LineType[],
    playerWon: boolean,
    solution: SolutionType,
    submitInProgress: boolean,
};

type GameStateAction = (
    { type: "LOADED", isLoaded: boolean, error?: ErrorType }
    | { type: "ERROR", }
    | { type: "SUBMITING", submitInProgress: boolean }
    | { type: "NEXT_STEP", playerWon: boolean, lines: LineType[], solution: SolutionType, error?: ErrorType });

const Game: React.FC<{}> = () => {
    const context = useContext(GameContext)

    const generateLines = (settings: GameSettings): LineType[] => {
        const emptyLine = {
            guess: emptyGuess.map(e => e),
            result: Array.from({ length: settings.pins }, () => NEUTRALSMALLPIN),
        }
        return Array.from({ length: settings.lines }, () => emptyLine)
    }

    const [state, setState] = useReducer((prevState: GameState, action: GameStateAction): GameState => {
        return {
            ...prevState,
            ...action
        }
    }, {
        error: null,
        isLoaded: false,
        submitInProgress: false,
        lines: generateLines(defaultSettings),
        playerWon: false,
        solution: null,
    })


    useEffect(() => {
        fetch("/api/start")
            .then(res => res.json())
            .then(
                (result) => {
                    context.setId(result.id)
                    setState({
                        type: "LOADED",
                        isLoaded: true,
                    });
                },
                (error) => {
                    console.error(error)
                    setState({
                        type: "LOADED",
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
                type: "LOADED",
                isLoaded: true,
                error: { message: "Please fill each slot!" },
            });
        } else {
            setState({
                type: "SUBMITING",
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
                                type: "LOADED",
                                isLoaded: true,
                                error: { message: result.message }
                            });
                        } else {
                            setState({
                                type: "NEXT_STEP",
                                playerWon: result.playerWon,
                                lines: setLineFromResponse(state.lines, result),
                                solution: result.solution ? result.solution : null,
                                error: null
                            });
                        }
                    },
                    (error) => {
                        console.error(error)
                        setState({
                            type: "LOADED",
                            isLoaded: true,
                            error: { message: "There was an error during server request, sorry for the inconvenience :(" },
                        });
                    }
                )
                .then(() => setState({ type: "SUBMITING", submitInProgress: false }))
        }
    }

    const { error, isLoaded, submitInProgress } = state;
    const lessLine = context.actualLine < context.settings.lines
    return (
        <div className="game">
            <Header
                lessLine={lessLine}
                playerWon={state.playerWon}
                error={error}
                isLoaded={isLoaded}
            />
            {(isLoaded) && (
                <PlayArea
                    submitInProgress={submitInProgress}
                    submitGuess={submitGuess}
                    lines={state.lines}
                    isOver={state.playerWon || (!state.playerWon && !lessLine)}
                    solution={state.solution}
                    actualLine={context.actualLine}
                />
            )}
            <Footer />
        </div>
    )
}

export { Game };