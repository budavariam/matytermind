import React from 'react';
import { Line } from './Line';
import { GameResponse, GameSettings, GameContextType } from './types';
import { GameContext, defaultSettings, emptyGuess, GOODGUESSPINID, GOODCOLOURPINID, NEUTRALSMALLPIN } from './context/GameContext';
import "./game.scss";

type GameState = {
    error: { message: string } | null,
    isLoaded: boolean,
    lines: any[],
    isOver: boolean,
};

class Game extends React.Component<{}, GameState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            lines: this.generateLines(defaultSettings),
            isOver: false,
        };
    }


    componentDidMount() {
        fetch("/api/start")
            .then(res => res.json())
            .then(
                (result) => {
                    this.context.setId(result.id)
                    this.setState({
                        isOver: result.isOver,
                        isLoaded: true,
                    });
                },
                (error) => {
                    console.error(error)
                    this.setState({
                        isLoaded: true,
                        error: { message: "There was an error during server request, sorry for the inconvenience :(" },
                    });
                }
            )
    }

    setLineFromResponse(lineIndex: number, lines: any[], data: GameResponse, guess: number[], CONTEXTpins: number): any[] {
        const evaluation = []
        for (let i = 0; i < data.goodGuess; i++) {
            evaluation.push(GOODGUESSPINID)
        }
        for (let i = 0; i < data.goodColour; i++) {
            evaluation.push(GOODCOLOURPINID)
        }
        while (evaluation.length < CONTEXTpins) {
            evaluation.push(NEUTRALSMALLPIN)
        }
        lines[lineIndex] = {
            guess: guess.map(e => e),
            result: evaluation,
        }
        return lines
    }

    submitGuess(id: string, guess: number[], settings: GameSettings, actualLine: number, nextLine: ()=>void) {
        if (guess.some(el => el < 0 || el > settings.colours)) {
            console.error("Invalid data!")
        } else {
            fetch('/api/guess', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, guess })
            })
                .then(res => res.json())
                .then(
                    (result: GameResponse) => {
                        if (result.message) {
                            this.setState({ error: { message: result.message } });
                        } else {
                            this.setState((state) => {
                                nextLine()
                                return {
                                    isOver: result.isOver,
                                    lines: this.setLineFromResponse(actualLine, state.lines, result, guess, settings.pins),
                                }
                            });
                        }
                    },
                    (error) => {
                        console.error(error)
                        this.setState({
                            isLoaded: true,
                            error: { message: "There was an error during server request, sorry for the inconvenience :(" },
                        });
                    }
                )
        }
    }

    generateLines(settings: GameSettings) {
        const emptyLine = {
            guess: emptyGuess.map(e => e),
            result: Array.from({ length: settings.pins }, () => NEUTRALSMALLPIN),
        }
        return Array.from({ length: settings.lines }, () => emptyLine)
    }

    renderLines(CONTEXTactualLine: number) {
        return this.state.lines.map((line: any, index: number) =>
            (<Line key={index} pins={line.guess} results={line.result} actual={(!this.state.isOver) && (index === CONTEXTactualLine)}></Line>)
        )
    }

    render() {
        const { error, isLoaded } = this.state;
        if (error) {
            return <div className="header">Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div className="header">Loading...</div>;
        } else {
            return (
                <GameContext.Consumer>
                    {({ actualLine, settings, id, actualGuess, nextLine }) => (
                        <div className="game">
                            <div className="header">
                                {(this.state.isOver && actualLine < settings.lines) && (
                                    <div className="button" onClick={() => { window.location.reload(); }} >Congratulations!<br />You won!<br />Do you want to play again?</div>
                                )}
                                {(!this.state.isOver && actualLine === settings.lines) && (
                                    <div className="button" onClick={() => { window.location.reload(); }}>You lost :( Try again?</div>
                                )}
                                {(!this.state.isOver && actualLine < settings.lines) && (
                                    <div className="button" onClick={
                                        () => this.submitGuess(id, actualGuess, settings, actualLine, nextLine)
                                    }>Submit guess</div>)
                                }
                            </div>
                            <div className="linecontainer">
                                {this.renderLines(actualLine)}
                            </div>
                        </div>
                    )}
                </GameContext.Consumer>
            );
        }
    }
}

Game.contextType = GameContext;
export { Game };