import React from 'react';
import { Line } from './Line';
import { GameResponse } from './types';

type GameState = {
    error: { message: string } | null,
    isLoaded: boolean,
    id: string,
    currentLine: number,
    lines: any[],
};

const NEUTRALPIN = 0;
const GOODGUESSPINID = 1;
const GOODCOLOURPINID = 2;

export class Game extends React.Component<{}, GameState> {
    private config: any;
    constructor(props: any) {
        super(props);
        this.config = {
            pins: 4,
            colours: 6,
            lines: 10,
        }
        this.state = {
            error: null,
            isLoaded: false,
            id: "",
            currentLine: 0,
            lines: [],
        };
    }

    componentDidMount() {
        fetch("/api/start")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        id: result.id
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

    addLineFromResponse(lines: any[], data: GameResponse, guess: number[]): any[] {
        const evaluation = []
        for (let i = 0; i < data.goodGuess; i++) {
            evaluation.push(GOODGUESSPINID)
        }
        for (let i = 0; i < data.goodColour; i++) {
            evaluation.push(GOODCOLOURPINID)
        }
        while (evaluation.length < this.config.pins) {
            evaluation.push(NEUTRALPIN)
        }
        lines.push({
            guess,
            result: evaluation,
        })
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
                            lines: this.addLineFromResponse(state.lines, result, guess),
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

    generateLines() {
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
                    <button onClick={() => this.submitGuess(id, [1, 4, 5, 3])}>Submit guess</button>
                    {this.generateLines()}
                </div>
            );
        }
    }
}