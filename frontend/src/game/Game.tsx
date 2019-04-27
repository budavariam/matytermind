import React from 'react';
import { Line } from './Line';
import { GameResponse, GameSettings } from './types';
import { GameContext, defaultSettings } from './context/GameContext';

type GameState = {
    error: { message: string } | null,
    isLoaded: boolean,
    context: {
        id: string,
        settings: GameSettings,
    },
    currentLine: number,
    lines: any[],
};

const NEUTRALHUGEPIN = -1;
const NEUTRALSMALLPIN = 0;
const GOODGUESSPINID = 1;
const GOODCOLOURPINID = 2;

class Game extends React.Component<{}, GameState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            context: {
                id: "",
                settings: defaultSettings,
            },
            error: null,
            isLoaded: false,
            currentLine: 0,
            lines: this.generateLines(defaultSettings),
        };
    }

    componentDidMount() {
        fetch("/api/start")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        context: {
                            id: result.id,   
                            settings: result.settings,
                        }
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
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
            guess,
            result: evaluation,
        }
        return lines
    }

    submitGuess(id: string, guess: number[]) {
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
                        this.setState({error: {message: result.message}});
                    } else {
                        this.setState((state) => ({
                            currentLine: state.currentLine + 1,
                            lines: this.setLineFromResponse(state.currentLine, state.lines, result, guess),
                        }));
                    }
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    generateLines(settings: GameSettings) {
        const emptyLine = {
            guess: Array.from({length: settings.pins}, () => NEUTRALHUGEPIN),
            result: Array.from({length: settings.pins}, () => NEUTRALSMALLPIN),
        }
        return Array.from({length: settings.lines}, () => emptyLine)
    }

    renderLines() {
        return this.state.lines.map((line: any, index: number) =>
            (<Line key={index} pins={line.guess} results={line.result} actual={index === this.state.currentLine} settings={this.state.context.settings}></Line>)
        )
    }

    render() {
        const { error, isLoaded, context } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <GameContext.Provider value={this.state.context}>
                    <div className="game">
                        <button onClick={
                            () => this.submitGuess(context.id, Array.from({length: this.state.context.settings.pins}, () => Math.floor(Math.random() * this.state.context.settings.colours)))
                        }>Submit guess</button>
                        {this.renderLines()}
                    </div>
                </GameContext.Provider>
            );
        }
    }
}

Game.contextType = GameContext;

export {Game};