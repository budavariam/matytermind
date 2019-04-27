import React from 'react';
import { Line } from './Line';
import { GameResponse } from './types';

type GameState = {
    error: { message: string } | null,
    isLoaded: boolean,
    id: string,
    currentLine: number,
    lines: any[],
    settings: GameSettings,
};

type GameSettings = {
    pins: number,
    colours: number,
    lines: number,
}

const NEUTRALHUGEPIN = -1;
const NEUTRALSMALLPIN = 0;
const GOODGUESSPINID = 1;
const GOODCOLOURPINID = 2;

export class Game extends React.Component<{}, GameState> {
    constructor(props: any) {
        super(props);
        const defaultSettings = {
            pins: 4,
            colours: 6,
            lines: 10,
        }
        this.state = {
            error: null,
            isLoaded: false,
            id: "",
            currentLine: 0,
            lines: this.generateLines(defaultSettings),
            settings: defaultSettings
        };
    }

    componentDidMount() {
        fetch("/api/start")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        id: result.id,
                        settings: result.settings,
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
        while (evaluation.length < this.state.settings.pins) {
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
            (<Line key={index} pins={line.guess} results={line.result} actual={index === this.state.currentLine}></Line>)
        )
    }

    render() {
        const { error, isLoaded, id } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="game">
                    <button onClick={
                        () => this.submitGuess(id, Array.from({length: this.state.settings.pins}, () => Math.floor(Math.random() * this.state.settings.colours)))
                    }>Submit guess</button>
                    {this.renderLines()}
                </div>
            );
        }
    }
}