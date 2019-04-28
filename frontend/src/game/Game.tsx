import React from 'react';
import { Line } from './Line';
import { GameResponse, GameSettings, GameContextType } from './types';
import { GameContext, defaultSettings, emptyGuess, GOODGUESSPINID, GOODCOLOURPINID, NEUTRALSMALLPIN } from './context/GameContext';
import "./game.scss";

type GameState = {
    error: { message: string } | null,
    isLoaded: boolean,
    context: GameContextType,
    lines: any[],
    isOver: boolean,
};

class Game extends React.Component<{}, GameState> {
    public changeGuess(actualGuess: number[]): void {
        this.setState(state => {
            const context = state.context
            context.actualGuess = actualGuess
            return { context }
        })
    };;
    constructor(props: {}) {
        super(props);
        this.state = {
            context: {
                id: "",
                settings: defaultSettings,
                actualGuess: emptyGuess,
                actualLine: 0,
                changeGuess: this.changeGuess
            },
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
                    this.setState({
                        isOver: result.isOver,
                        isLoaded: true,
                        context: {
                            id: result.id,
                            settings: result.settings,
                            actualLine: 0,
                            actualGuess: emptyGuess,
                            changeGuess: (actualGuess: number[]) => { this.changeGuess(actualGuess) }
                        }
                    });
                },
                (error) => {
                    console.error(error)
                    this.setState({
                        isLoaded: true,
                        error: {message: "There was an error during server request, sorry for the inconvenience :("},
                    });
                }
            )
    }

    setLineFromResponse(lineIndex: number, lines: any[], data: GameResponse, guess: number[]): any[] {
        const evaluation = []
        for (let i = 0; i < data.goodGuess; i++) {
            evaluation.push(GOODGUESSPINID)
        }
        for (let i = 0; i < data.goodColour; i++) {
            evaluation.push(GOODCOLOURPINID)
        }
        while (evaluation.length < this.state.context.settings.pins) {
            evaluation.push(NEUTRALSMALLPIN)
        }
        lines[lineIndex] = {
            guess: guess.map(e => e),
            result: evaluation,
        }
        return lines
    }

    submitGuess(id: string, guess: number[]) {
        if (guess.some(el => el < 0 || el > this.state.context.settings.colours)) {
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
                                const context = Object.assign({}, state.context)
                                context.actualLine++
                                return {
                                    isOver: result.isOver,
                                    context,
                                    lines: this.setLineFromResponse(state.context.actualLine, state.lines, result, guess),
                                }
                            });
                        }
                    },
                    (error) => {
                        console.error(error)
                        this.setState({
                            isLoaded: true,
                            error: {message: "There was an error during server request, sorry for the inconvenience :("},
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

    renderLines() {
        return this.state.lines.map((line: any, index: number) =>
            (<Line key={index} pins={line.guess} results={line.result} actual={(!this.state.isOver) && (index === this.state.context.actualLine)}></Line>)
        )
    }

    render() {
        const { error, isLoaded, context } = this.state;
        if (error) {
            return <div className="header">Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div className="header">Loading...</div>;
        } else {
            return (
                <GameContext.Provider value={this.state.context}>
                    <div className="game">
                        <div className="header">
                            {(this.state.isOver && this.state.context.actualLine < this.state.context.settings.lines) && (
                                <div className="button" onClick={() => {window.location.reload();}} >Congratulations!<br/>You won!<br/>Do you want to play again?</div>
                            )}
                            {(!this.state.isOver && this.state.context.actualLine === this.state.context.settings.lines) && (
                                <div className="button" onClick={() => {window.location.reload();}}>You lost :( Try again?</div>
                            )}
                            {(!this.state.isOver && this.state.context.actualLine < this.state.context.settings.lines) && (
                                <div className="button" onClick={
                                    () => this.submitGuess(context.id, this.state.context.actualGuess)
                                }>Submit guess</div>)
                            }
                        </div>
                        <div className="linecontainer">
                            {this.renderLines()}
                        </div>
                    </div>
                </GameContext.Provider>
            );
        }
    }
}

Game.contextType = GameContext;

export { Game };