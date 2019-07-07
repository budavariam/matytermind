import React from 'react';
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

class Game extends React.Component<{}, GameState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            submitInProgress: false,
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

    setLineFromResponse(lines: LineType[], data: GameResponse): LineType[] {
        const evaluation = []
        for (let i = 0; i < data.goodGuess; i++) {
            evaluation.push(GOODGUESSPINID)
        }
        for (let i = 0; i < data.goodColour; i++) {
            evaluation.push(GOODCOLOURPINID)
        }
        while (evaluation.length < this.context.settings.pins) {
            evaluation.push(NEUTRALSMALLPIN)
        }
        lines[this.context.actualLine] = {
            guess: this.context.actualGuess.map((e: number) => e),
            result: evaluation,
        }
        this.context.nextLine()
        return lines
    }

    submitGuess() {
        if (this.context.actualGuess.some((el: number) => el < 0 || el > this.context.settings.colours)) {
            this.setState({
                error: { message: "Please fill each slot!" },
            });
        } else if (!this.state.submitInProgress) {
            this.setState({
                submitInProgress: true,
            }, () => fetch('/api/guess', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: this.context.id, guess: this.context.actualGuess })
            })
                .then(res => res.json())
                .then(
                    (result: GameResponse) => {
                        if (result.message) {
                            this.setState({ error: { message: result.message } });
                        } else {
                            this.setState((state) => {
                                return {
                                    isOver: result.isOver,
                                    lines: this.setLineFromResponse(state.lines, result),
                                    error: null
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
                .then(() => this.setState({ submitInProgress: false }))
            );
        }
    }

    generateLines(settings: GameSettings): LineType[] {
        const emptyLine = {
            guess: emptyGuess.map(e => e),
            result: Array.from({ length: settings.pins }, () => NEUTRALSMALLPIN),
        }
        return Array.from({ length: settings.lines }, () => emptyLine)
    }

    renderLines(submitButton: JSX.Element) {
        return this.state.lines.map((line: LineType, index: number) =>
            (<Line
                key={index}
                pins={line.guess}
                results={line.result}
                actual={(!this.state.isOver) && (index === this.context.actualLine)}
                actionButton={submitButton}>
            </Line>)
        )
    }

    render() {
        const { error, isLoaded, submitInProgress } = this.state;
        const submitButton = (<div className="button" onClick={() => this.submitGuess()}>OK</div>)
        const waitingForResponse = (<div className="spinner"></div>)
        return (
            <div className="game">
                <Header
                    lessLine={this.context.actualLine < this.context.settings.lines}
                    isOver={this.state.isOver}
                    error={error}
                    isLoaded={isLoaded}
                >
                </Header>
                {(isLoaded) && (
                    <div className="linecontainer">
                        {this.renderLines(submitInProgress ? waitingForResponse : submitButton)}
                    </div>
                )}
                <Footer></Footer>
            </div>
        )
    }
}

Game.contextType = GameContext;
export { Game };