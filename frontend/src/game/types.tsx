export type GameResponse = {
    goodGuess: number,
    goodColour: number,
    playerWon: boolean,
    message?:string,
    solution?: number[],
}

export type GameSettings = {
    pins: number,
    colours: number,
    lines: number,
}

export type GuessType = number[]

export type GameContextType = {
    id: string,
    settings: GameSettings,
    actualGuess: GuessType,
    actualLine: number,
    changeGuess: (actualGuess: GuessType) => void,
    nextLine: () => void,
    setId: (id: string) => void,
}

export type LineType = {
    guess: GuessType,
    result: GuessType,
}

export type SolutionType = null | GuessType
export type ErrorType = { message: string } | null