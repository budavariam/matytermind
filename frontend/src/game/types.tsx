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