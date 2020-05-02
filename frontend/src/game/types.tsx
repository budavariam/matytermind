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

export type GameContextType = {
    id: string,
    settings: GameSettings,
    actualGuess: number[],
    actualLine: number,
    changeGuess: (actualGuess: number[]) => void,
    nextLine: () => void,
    setId: (id: string) => void,
}

export type LineType = {
    guess: number[],
    result: number[],
}