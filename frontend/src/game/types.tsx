export type GameResponse = {
    goodGuess: number,
    goodColour: number,
    isOver: boolean,
    message?:string,
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