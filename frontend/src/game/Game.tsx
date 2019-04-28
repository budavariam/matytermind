import React from 'react';
import { Line } from './Line';
import { GameResponse, GameSettings, GameContextType } from './types';
import { GameContext, defaultSettings, emptyGuess, GOODGUESSPINID, GOODCOLOURPINID, NEUTRALSMALLPIN } from './context/GameContext';

type GameState = {
    error: { message: string } | null,
    isLoaded: boolean,
    context: GameContextType,
    currentLine: number,
    lines: any[],
};

class Game extends React.Component<{}, GameState> {
    public changeGuess(actualGuess: number[]): void {
        this.setState(state => {
            const context = state.context
            context.actualGuess = actualGuess
            return {context}
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
                            actualLine: 0,
                            actualGuess: emptyGuess,
                            changeGuess: (actualGuess: number[]) => {this.changeGuess(actualGuess) }
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
            guess: guess.map(e=>e),
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
                        this.setState({ error: { message: result.message } });
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
            guess: emptyGuess.map(e => e),
            result: Array.from({ length: settings.pins }, () => NEUTRALSMALLPIN),
        }
        return Array.from({ length: settings.lines }, () => emptyLine)
    }
    
    renderLines() {
        return this.state.lines.map((line: any, index: number) =>
            (<Line key={index} pins={line.guess} results={line.result} actual={index === this.state.currentLine}></Line>)
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
                            () => this.submitGuess(context.id, this.state.context.actualGuess)
                        }>Submit guess</button>
                        {this.renderLines()}
                    </div>
                </GameContext.Provider>
            );
        }
    }
}

Game.contextType = GameContext;

export { Game };